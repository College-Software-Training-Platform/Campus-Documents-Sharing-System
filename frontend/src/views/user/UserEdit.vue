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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue' // 必须引入 Plus 图标

const router = useRouter()
const submitting = ref(false)

// 预览图片路径
const imageUrl = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

const editForm = reactive({
  nickname: '重邮学生',
  bio: '计科专业 | 考研党',
  major: 'CS',
  avatarUrl: '' // 存储后端返回的地址
})

// 上传前校验
const beforeAvatarUpload = (rawFile) => {
  const isTypeValid = ['image/jpeg', 'image/png'].includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isTypeValid) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传成功回调
const handleAvatarSuccess = (response, uploadFile) => {
  // 模拟：通常这里会拿 response.url
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  editForm.avatarUrl = response.url || '' 
  ElMessage.success('头像上传成功')
}

const handleSave = () => {
  submitting.value = true
  // 这里你应该调用后端 API，例如 axios.post('/api/user/update', editForm)
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('个人资料已更新')
    router.push('/user/Profile')
  }, 800)
}
</script>

<style scoped>
.edit-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 0 20px;
}
.edit-card {
  border-radius: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header .title {
  font-weight: bold;
  font-size: 18px;
}

/* 头像上传组件专属样式 */
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 50%; /* 圆形边框 */
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>