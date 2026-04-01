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

const router = useRouter()
const submitting = ref(false)

const editForm = reactive({
  nickname: '重邮学生',
  bio: '计科专业 | 考研党',
  major: 'CS'
})

const handleSave = () => {
  submitting.value = true
  // 模拟 API 请求
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('资料保存成功')
    router.push('/user/Profile') // 保存成功跳回个人中心
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
</style>