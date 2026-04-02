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
            action="/api/user/upload-avatar" 
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
            <el-option label="计算机科学与技术" value="CS" />
            <el-option label="软件工程" value="SE" />
            <el-option label="通信工程" value="CE" />
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

// 固定测试学号（后期可改为从 localStorage 获取）
const targetStudentId = '2024214283'

const editForm = reactive({
  nickname: '',
  bio: '',
  major: '',
  avatarUrl: '',
  studentId: targetStudentId // 必须传给后端
})

// --- 1. 进页面先获取当前资料，填充表单 ---
const fetchCurrentData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users/profile', {
      params: { studentId: targetStudentId }
    })
    if (res.data.code === 200) {
      const data = res.data.data
      editForm.nickname = data.name    // 注意：后端字段是 name
      editForm.bio = data.bio
      editForm.major = data.major
      editForm.avatarUrl = data.avatar_Url
      imageUrl.value = data.avatar_Url || defaultAvatar
    }
  } catch (error) {
    ElMessage.error('无法加载当前资料')
  }
}

onMounted(fetchCurrentData)

// --- 2. 上传头像逻辑 ---
const beforeAvatarUpload = (rawFile) => {
  const isTypeValid = ['image/jpeg', 'image/png'].includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isTypeValid) ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  if (!isLt2M) ElMessage.error('头像大小不能超过 2MB!')
  return isTypeValid && isLt2M
}

const handleAvatarSuccess = (response) => {
  // 假设后端上传接口返回 { code: 200, url: 'http://...' }
  imageUrl.value = response.url 
  editForm.avatarUrl = response.url 
  ElMessage.success('头像上传成功')
}

// --- 3. 提交修改到后端 ---
const handleSave = async () => {
  if (!editForm.nickname) return ElMessage.warning('昵称不能为空')
  
  submitting.value = true
  try {
    // 对应你后端 userController.js 中的 updateProfile 函数
    const res = await axios.post('http://localhost:3000/api/users/update', {
      studentId: editForm.studentId,
      nickname: editForm.nickname,
      bio: editForm.bio,
      major: editForm.major
    })

    if (res.data.code === 200) {
      ElMessage.success('个人资料已更新')
      router.push('/user/Profile') // 跳回详情页，触发详情页重新加载
    } else {
      ElMessage.error(res.data.message || '更新失败')
    }
  } catch (error) {
    console.error('更新报错:', error)
    ElMessage.error('系统繁忙，请稍后再试')
  } finally {
    submitting.value = false
  }
}
</script>