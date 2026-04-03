<template>
  <div class="edit-container">
    <el-card class="edit-card">
      <template #header>
        <div class="card-header">
          <span class="title">编辑个人资料</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form :model="editForm" label-width="100px" label-position="left">
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/api/users/upload-avatar" 
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="avatar"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar-preview" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">支持 JPG/PNG，不超过 2MB</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input 
            v-model="editForm.bio" 
            type="textarea" 
            :rows="3" 
            placeholder="介绍一下自己吧"
          />
        </el-form-item>

        <el-form-item label="所属专业">
          <el-select v-model="editForm.major" placeholder="请选择专业" style="width: 100%">
            <el-option label="计算机科学与技术" value="计算机科学与技术" />
            <el-option label="软件工程" value="软件工程" />
            <el-option label="通信工程" value="通信工程" />
            <el-option label="电子信息" value="电子信息" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="submitting">保存修改</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const submitting = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const imageUrl = ref('')

/**
 * 🛠️ 关键修正：动态获取当前登录学号
 * 不再写死 '2024214283'。
 */
const currentStudentId = localStorage.getItem('studentId')

const editForm = reactive({
  nickname: '',
  bio: '',
  major: '',
  avatarUrl: '', // 对应后端 updateProfile 接收的参数名
  studentId: currentStudentId 
})

// --- 步骤 1: 进入页面时自动填充已有资料 ---
const fetchCurrentData = async () => {
  if (!currentStudentId) {
    ElMessage.error('未检测到登录学号，请重新登录')
    return
  }

  try {
    // 这里的接口路径需与后端 router 定义一致
    const res = await axios.get('http://localhost:3000/api/users/profile', {
      params: { studentId: currentStudentId }
    })

    if (res.data.code === 200) {
      const data = res.data.data
      // ✅ 字段映射：后端返回的是 name，前端对应 nickname
      editForm.nickname = data.name
      editForm.bio = data.bio || ''
      editForm.major = data.major || ''
      editForm.avatarUrl = data.avatar_Url // 后端数据库字段是 avatar_Url
      imageUrl.value = data.avatar_Url || defaultAvatar
      console.log('当前资料加载成功:', data)
    }
  } catch (error) {
    console.error('获取资料失败:', error)
    ElMessage.error('无法同步个人资料，请检查后端运行状态')
  }
}

onMounted(fetchCurrentData)

// --- 步骤 2: 头像上传校验与预览 ---
const beforeAvatarUpload = (rawFile) => {
  const isTypeValid = ['image/jpeg', 'image/png'].includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isTypeValid) ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  if (!isLt2M) ElMessage.error('头像大小不能超过 2MB!')
  return isTypeValid && isLt2M
}

const handleAvatarSuccess = (response) => {
  // 假设后端上传接口成功后返回 { code: 200, url: '...' }
  if (response.code === 200 || response.url) {
    imageUrl.value = response.url 
    editForm.avatarUrl = response.url 
    ElMessage.success('头像预览已更新，点击保存生效')
  }
}

// --- 步骤 3: 提交保存 ---
const handleSave = async () => {
  if (!editForm.nickname) return ElMessage.warning('昵称不能为空')
  
  submitting.value = true
  try {
    // 🚀 这里传的字段名必须和后端 updateProfile 解构的参数名完全一致
    const res = await axios.post('http://localhost:3000/api/users/update', {
      studentId: editForm.studentId, // 用于后端 where 匹配
      nickname: editForm.nickname,   // 后端会将其赋值给数据库的 name
      bio: editForm.bio,
      major: editForm.major,
      avatarUrl: editForm.avatarUrl  // 后端会将其赋值给数据库的 avatar_Url
    })

    if (res.data.code === 200) {
      ElMessage.success('个人资料已成功同步到数据库')
      // 跳转回个人详情页
      router.push('/user/Profile')
    } else {
      ElMessage.error(res.data.message || '更新失败')
    }
  } catch (error) {
    console.error('保存报错:', error)
    ElMessage.error('更新系统繁忙，请稍后再试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.edit-container { padding: 20px; display: flex; justify-content: center; background-color: #f5f7fa; min-height: 100vh; }
.edit-card { width: 100%; max-width: 550px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-weight: bold; font-size: 18px; }
.avatar-uploader { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; overflow: hidden; margin-bottom: 10px; }
.avatar-uploader:hover { border-color: #409eff; }
.avatar-preview { width: 100px; height: 100px; object-fit: cover; }
.avatar-uploader-icon { font-size: 28px; color: #8c939d; }
</style>