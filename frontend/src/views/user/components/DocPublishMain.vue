<template>
  <el-card class="publish-main-card" shadow="never">
    <el-form label-position="top" class="publish-form">
      <!-- 文件上传 -->
      <el-form-item label="文件上传">
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          multiple
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            <strong>点击或拖拽文件至此上传</strong>
            <p class="upload-tip">支持 PDF, DOCX, ZIP 等格式，单个文件不超过 50MB</p>
            <p class="upload-tip">请确保文件内容完整，命名清晰</p>
          </div>
        </el-upload>
      </el-form-item>

      <!-- 资源标题 -->
      <el-form-item label="资源标题" class="mt-4">
        <el-input 
          v-model="publishForm.title" 
          placeholder="例如：2023秋季高等数学期末考试重点复习笔记" 
          size="large"
        />
      </el-form-item>

      <!-- 分类与标签 -->
      <el-row :gutter="24" class="mt-4">
        <el-col :span="12">
          <el-form-item label="所属课程">
            <el-input 
              v-model="publishForm.courseName" 
              placeholder="请输入所属课程名称，如：高等数学" 
              size="large" 
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源标签">
            <el-input 
              v-model="tagInput" 
              placeholder="输入标签按回车添加" 
              size="large"
              @keyup.enter="addTag"
            />
            <div class="tags-container mt-2" v-if="publishForm.tags.length > 0">
              <CommonTag
                v-for="tag in publishForm.tags"
                :key="tag"
                :text="tag"
                closable
                class="mr-2"
                @close="removeTag(tag)"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 资源描述 -->
      <el-form-item label="资源描述" class="mt-4 description-item">
        <template #label>
          <div class="desc-label">
            <span>资源描述</span>
            <el-button 
              type="primary" 
              plain 
              size="small" 
              class="ai-btn" 
              @click="generateAISummary"
              :loading="aiLoading"
            >
              <el-icon><MagicStick /></el-icon> AI 生成摘要
            </el-button>
          </div>
        </template>
        <el-input
          v-model="publishForm.ai_Summary"
          type="textarea"
          :rows="6"
          placeholder="请详细描述资源内容，帮助其他用户了解资料价值..."
        />
      </el-form-item>

      <!-- 下载所需积分 -->
      <el-form-item label="下载所需积分" class="mt-4 points-item">
        <el-input-number 
          v-model="publishForm.points" 
          :min="0" :max="100" 
          size="large"
          controls-position="right"
          class="points-input"
        />
        <span class="points-unit">积分</span>
        <div class="points-tip">建议定价：0-50 积分</div>
      </el-form-item>

      <!-- 协议勾选 -->
      <el-form-item class="mt-4">
        <el-checkbox v-model="publishForm.agreement">
          我已阅读并同意 <el-link type="primary" :underline="false">《智慧校园资源共享平台服务协议》</el-link>。我保证上传的内容不违反法律法规且不侵犯他人知识产权。
        </el-checkbox>
      </el-form-item>

      <!-- 底部按钮 -->
      <div class="form-actions">
        <el-button size="large" class="cancel-btn">取消</el-button>
        <el-button 
          type="primary" 
          size="large" 
          class="submit-btn" 
          :icon="Position" 
          @click="handleSubmit"
          :loading="submitLoading"
        >
          立即发布
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UploadFilled, MagicStick, Position } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import CommonTag from './CommonTag.vue'
import request from '@/utils/request' // 使用自定义请求工具（含 Token）

const router = useRouter()
const aiLoading = ref(false)
const submitLoading = ref(false)
const selectedFile = ref(null)

const publishForm = reactive({
  title: '',
  courseName: '',
  tags: [],
  ai_Summary: '',
  points: 0,
  agreement: false
})

const tagInput = ref('')

const handleFileChange = (file) => {
  selectedFile.value = file.raw
}

const addTag = () => {
  if (tagInput.value.trim() && !publishForm.tags.includes(tagInput.value.trim())) {
    publishForm.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  publishForm.tags = publishForm.tags.filter(t => t !== tag)
}

// AI 生成摘要逻辑 (保持现有逻辑，仅更换请求工具)
const generateAISummary = async () => {
  if (!publishForm.title.trim()) {
    ElMessage.warning('请输入标题后，AI 才能根据标题生成描述')
    return
  }

  aiLoading.value = true
  try {
    const response = await request.post('/ai/generate-summary', {
      title: publishForm.title.trim()
    })

    if (response.success) {
      publishForm.ai_Summary = response.summary
      ElMessage.success('摘要已成功生成')
    }
  } catch (error) {
    console.error('AI Summary Error:', error)
  } finally {
    aiLoading.value = false
  }
}

const handleSubmit = async () => {
  // 1. 基础校验
  if (!selectedFile.value) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }
  if (!publishForm.title.trim()) {
    ElMessage.warning('请输入资源标题')
    return
  }
  if (!publishForm.courseName.trim()) {
    ElMessage.warning('请输入所属课程')
    return
  }
  if (!publishForm.agreement) {
    ElMessage.warning('请阅读并勾选服务协议')
    return
  }

  submitLoading.value = true
  
  // 2. 构造 FormData 用于文件上传
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('title', publishForm.title)
  formData.append('courseName', publishForm.courseName)
  formData.append('tags', JSON.stringify(publishForm.tags))
  formData.append('ai_Summary', publishForm.ai_Summary)
  formData.append('points', publishForm.points)

  // 3. 调用后端 API
  try {
    const res = await request.post('/resources/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.code === 201) {
      ElMessage.success('资源发布成功，正在跳转发现页...')
      setTimeout(() => {
        router.push('/user/DiscoverTrend')
      }, 1500)
    }
  } catch (error) {
    console.error('Publish Error:', error)
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.publish-main-card {
  border-radius: 12px;
  border: none;
  padding: 10px 20px;
}

.upload-area {
  width: 100%;
}

:deep(.el-upload-dragger) {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 40px;
}

:deep(.el-upload-dragger:hover) {
  border-color: #3b82f6;
}

.el-icon--upload {
  font-size: 48px;
  color: #3b82f6;
  margin-bottom: 20px;
}

.upload-tip {
  font-size: 13px;
  color: #64748b;
  margin-top: 8px;
  margin-bottom: 0;
}

.full-width {
  width: 100%;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mt-2 {
  margin-top: 8px;
}
.mt-4 {
  margin-top: 24px;
}
.mr-2 {
  margin-right: 8px;
}

.desc-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.ai-btn {
  border-radius: 20px;
  color: #3b82f6;
  border-color: #bfdbfe;
  background-color: #eff6ff;
}
.ai-btn:hover {
  background-color: #dbeafe;
}

.points-input {
  width: 180px;
}

.points-unit {
  margin-left: 12px;
  color: #0f172a;
  font-size: 14px;
}

.points-tip {
  width: 100%;
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn {
  width: 100px;
  border-radius: 8px;
}

.submit-btn {
  width: 140px;
  border-radius: 8px;
  background-color: #3b82f6;
  font-weight: 500;
}
</style>
