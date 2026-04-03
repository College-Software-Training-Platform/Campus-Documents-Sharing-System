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
  :on-error="handleAvatarError"
  :before-upload="beforeAvatarUpload"
  :headers="uploadHeaders" 
  name="avatar"
>
  <img v-if="imageUrl" :src="imageUrl" class="avatar-preview" />
  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
import { reactive, ref, onMounted, computed } from 'vue' // 引入 computed
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const submitting = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const imageUrl = ref('')

// --- 🚀 新增：配置上传请求头 ---
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : ''
  }
})

const currentStudentId = localStorage.getItem('studentId')

const editForm = reactive({
  nickname: '',
  bio: '',
  major: '',
  avatarUrl: '', 
  studentId: currentStudentId 
})

// --- 步骤 1: 加载数据 (保持不变) ---
const fetchCurrentData = async () => {
  if (!currentStudentId) {
    ElMessage.error('未检测到登录学号，请重新登录')
    return
  }
  try {
    const res = await axios.get('http://localhost:3000/api/users/profile', {
      params: { studentId: currentStudentId }
    })
    
    if (res.data.code === 200) {
      const data = res.data.data
      editForm.nickname = data.name
      editForm.bio = data.bio || ''
      editForm.major = data.major || ''
      
      // 🚀 核心修改开始：更加健壮的图片处理逻辑
      const rawPath = data.avatar_Url
      if (rawPath) {
        // 1. 保存原始路径到表单，提交时原样回传给后端
        editForm.avatarUrl = rawPath 
        
        // 2. 处理预览显示的 URL
        if (rawPath.startsWith('http')) {
          // 如果数据库里已经是完整路径了，直接用
          imageUrl.value = rawPath
        } else {
          // 如果是相对路径（如 uploads/abc.png），去掉开头的斜杠防止双斜杠，再拼接
          const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath
          imageUrl.value = `http://localhost:3000/${cleanPath}`
        }
      } else {
        imageUrl.value = defaultAvatar
      }
      // 🚀 核心修改结束
      
      console.log('当前预览图地址:', imageUrl.value) // 💡 调试用：在控制台看看这个地址对不对
    }
  } catch (error) {
    console.error('获取资料详细错误:', error)
    ElMessage.error('获取资料失败')
  }
}

onMounted(fetchCurrentData)

// --- 步骤 2: 头像上传处理 ---
const beforeAvatarUpload = (rawFile) => {
  const isTypeValid = ['image/jpeg', 'image/png'].includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isTypeValid) ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  if (!isLt2M) ElMessage.error('头像大小不能超过 2MB!')
  return isTypeValid && isLt2M
}

const handleAvatarSuccess = (response) => {
  // response 是后端 res.json 返回的内容
  if (response.code === 200) {
    // 1. 更新预览图 (后端返回的可能是完整 URL，也可能是路径)
    imageUrl.value = response.url 
    // 2. 核心：提取路径存入 editForm，以便 handleSave 时提交到数据库
    // 如果后端返回的是 http://.../uploads/xxx.jpg，我们只存 uploads/xxx.jpg
    const relativePath = response.url.split('http://localhost:3000/')[1] || response.url
    editForm.avatarUrl = relativePath 
    
    ElMessage.success('头像上传成功，保存后生效')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleAvatarError = (err) => {
  console.error('上传失败详情:', err)
  ElMessage.error('头像上传失败，请检查网络或登录状态')
}

// --- 步骤 3: 提交保存 (完善逻辑) ---
const handleSave = async () => {
  if (!editForm.nickname) return ElMessage.warning('昵称不能为空')
  
  submitting.value = true
  try {
    const res = await axios.post('http://localhost:3000/api/users/update', {
      studentId: editForm.studentId, 
      name: editForm.nickname,    // 🚀 改为 name，通常后端数据库字段是这个
      bio: editForm.bio,
      major: editForm.major,
      avatar_Url: editForm.avatarUrl // 🚀 改为 avatar_Url，与数据库保持一致
    })

    if (res.data.code === 200) {
      ElMessage.success('资料更新成功！')
      
      // 🌟 同步更新 localStorage 里的用户信息（可选，推荐）
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.name = editForm.nickname
      user.avatar_Url = editForm.avatarUrl
      localStorage.setItem('user', JSON.stringify(user))

      router.push('/user/Profile')
    }
  } catch (error) {
    ElMessage.error('保存失败')
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