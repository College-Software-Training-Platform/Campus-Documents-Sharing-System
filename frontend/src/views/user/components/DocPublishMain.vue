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
          <el-form-item label="所属课程/分类">
            <el-select 
              v-model="publishForm.category" 
              placeholder="请选择课程分类" 
              size="large" 
              class="full-width"
            >
              <el-option label="计算机科学" value="cs" />
              <el-option label="高等数学" value="math" />
            </el-select>
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
              <el-tag
                v-for="tag in publishForm.tags"
                :key="tag"
                closable
                type="info"
                class="mr-2"
                @close="removeTag(tag)"
              >
                {{ tag }}
              </el-tag>
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
          v-model="publishForm.description"
          type="textarea"
          :rows="6"
          placeholder="请详细描述资源内容，帮助其他用户了解资料价值..."
        />
      </el-form-item>

      <!-- 下载所需积分 -->
      <el-form-item label="下载所需积分" class="mt-4 points-item">
        <el-input-number 
          v-model="publishForm.points" 
          :min="0" :max="10" 
          size="large"
          controls-position="right"
          class="points-input"
        />
        <span class="points-unit">积分</span>
        <div class="points-tip">建议定价：0-10 积分</div>
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
        <el-button type="primary" size="large" class="submit-btn" :icon="Position">
          立即发布
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UploadFilled, MagicStick, Position } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const aiLoading = ref(false)

const publishForm = reactive({
  title: '',
  category: '',
  tags: ['笔记', '考研专用'],
  description: '',
  points: 0,
  agreement: false
})

const tagInput = ref('')

const addTag = () => {
  if (tagInput.value.trim() && !publishForm.tags.includes(tagInput.value.trim())) {
    publishForm.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  publishForm.tags = publishForm.tags.filter(t => t !== tag)
}

// AI 生成摘要逻辑
const generateAISummary = async () => {
  if (!publishForm.title || !publishForm.title.trim()) {
    ElMessage.warning('请输入标题后，AI 才能根据标题生成描述')
    return
  }

  aiLoading.value = true
  try {
    // 调用后端 API
    const response = await axios.post('http://localhost:3000/api/ai/generate-summary', {
      title: publishForm.title.trim()
    })

    if (response.data.success) {
      publishForm.description = response.data.summary
      ElMessage.success('摘要已成功生成')
    } else {
      ElMessage.error(response.data.message || '生成摘要时遇到一点小问题')
    }
  } catch (error) {
    console.error('AI Summary Error:', error)
    const errorMsg = error.response?.data?.message || '网络连接超时或后端服务未启动'
    ElMessage.error(errorMsg)
  } finally {
    aiLoading.value = false
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
