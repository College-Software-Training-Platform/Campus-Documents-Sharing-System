<template>
  <div class="document-detail-container">
    <el-row :gutter="24">
      <el-col :span="17">
        <el-card class="detail-main-card">
          <div class="doc-header">
            <div class="title-section">
              <img :src="getFileIcon(docData.file_Type)" alt="icon" width="40" height="40">
              <h1>{{ docData.title }}</h1>
            </div>
            <div class="meta-info">
              <span><el-icon><User /></el-icon> {{ docData.uploader_name || '匿名用户' }}</span>
              <span><el-icon><Calendar /></el-icon> {{ docData.upload_Time }}</span>
              <span><el-icon><View /></el-icon> {{ docData.view_Count || 0 }} 次浏览</span>
              <span><el-icon><Download /></el-icon> {{ docData.download_Count || 0 }} 次下载</span>
            </div>
          </div>

          <el-divider />

          <div class="doc-content">
            <h3>资源描述</h3>
            <p class="description">{{ docData.description || '该资源暂无描述。' }}</p>
            
            <div class="tags-group">
              <el-tag v-for="tag in docData.tags" :key="tag" class="doc-tag" effect="plain">
                # {{ tag }}
              </el-tag>
            </div>
          </div>

          <div v-if="docData.file_Type === 'pdf'" class="preview-section">
            <div class="preview-placeholder">
              <el-icon :size="40"><Document /></el-icon>
              <p>在线预览功能正在开发中...</p>
              <el-button type="primary" plain @click="handlePreview">点击全屏预览</el-button>
            </div>
          </div>
        </el-card>

        <el-card class="comment-card" title="资源评价">
          <template #header>
            <div class="card-header"><span>资源评价</span></div>
          </template>
          <div class="empty-comment">暂无评论，快来抢沙发吧！</div>
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card class="action-card">
          <div class="points-box">
            <span class="label">下载所需积分</span>
            <span class="value">{{ docData.required_Points }}</span>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" size="large" class="full-width" @click="handleDownload">
              <el-icon><Download /></el-icon> 立即下载
            </el-button>
            <el-button size="large" class="full-width" @click="handleCollect">
              <el-icon><Star /></el-icon> 收藏资源
            </el-button>
          </div>

          <div class="user-points-tip">
            您的当前积分：<span class="my-points">120</span>
          </div>
        </el-card>

        <el-card class="notice-card">
          <template #header><b>安全提示</b></template>
          <ul class="notice-list">
            <li>若资源无法下载，请联系管理员。</li>
            <li>请勿上传侵权或违法违规内容。</li>
            <li>下载后请于24小时内删除。</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Calendar, View, Download, Star, Document } from '@element-plus/icons-vue'

const route = useRoute()
const docData = ref({
  title: '加载中...',
  required_Points: 0,
  file_Type: 'pdf',
  tags: []
})

// 根据后缀名获取图标
const getFileIcon = (type) => {
  const iconMap = {
    pdf: new URL('@/assets/icon/pdf.svg', import.meta.url).href,
    zip: new URL('@/assets/icon/zip.svg', import.meta.url).href,
    word: new URL('@/assets/icon/word.svg', import.meta.url).href
  }
  return iconMap[type] || iconMap.pdf
}

// 获取详情数据
const fetchDetail = async () => {
  const id = route.params.id // 获取 URL 中的 ID
  // 这里调用你的后端接口，比如 GET /api/resources/:id
  console.log('正在获取资源ID:', id)
  
  // 模拟数据
  docData.value = {
    resource_ID: id,
    title: '2023 计算机网络期末复习重点总结',
    description: '本文档包含了计算机网络五层模型的详细考点，特别针对 TCP 三次握手和拥塞控制进行了深度解析。适合备考使用。',
    uploader_name: '学霸学长',
    upload_Time: '2026-03-25',
    view_Count: 1250,
    download_Count: 45,
    required_Points: 5,
    file_Type: 'pdf',
    tags: ['计算机网络', '考研', '期末复习'],
    file_Path: '#'
  }
}

// 下载处理
const handleDownload = () => {
  ElMessageBox.confirm(
    `下载此资源将扣除 ${docData.value.required_Points} 积分，是否继续？`,
    '确认下载',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
  ).then(() => {
    // 1. 调用扣分接口
    // 2. 调用下载接口
    ElMessage.success('积分扣除成功，正在开始下载...')
    window.location.href = docData.value.file_Path
  }).catch(() => {})
}

const handleCollect = () => {
  ElMessage.success('已加入收藏夹')
}

const handlePreview = () => {
  ElMessage('在线预览暂未开启')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.document-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-main-card {
  border-radius: 12px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.title-section h1 {
  font-size: 24px;
  color: #1e293b;
  margin: 0;
}

.meta-info {
  display: flex;
  gap: 20px;
  color: #64748b;
  font-size: 14px;
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.doc-content h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.description {
  line-height: 1.6;
  color: #475569;
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
}

.tags-group {
  margin-top: 20px;
}

.doc-tag {
  margin-right: 10px;
}

.preview-section {
  margin-top: 30px;
  background: #f1f5f9;
  height: 300px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  text-align: center;
  color: #94a3b8;
}

/* 右侧卡片样式 */
.action-card {
  text-align: center;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.points-box {
  background: #eff6ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.points-box .label {
  display: block;
  font-size: 14px;
  color: #3b82f6;
  margin-bottom: 5px;
}

.points-box .value {
  font-size: 32px;
  font-weight: 800;
  color: #1d4ed8;
}

.full-width {
  width: 100%;
  margin-left: 0 !important;
  margin-bottom: 12px;
}

.user-points-tip {
  font-size: 13px;
  color: #64748b;
  margin-top: 10px;
}

.my-points {
  color: #f59e0b;
  font-weight: bold;
}

.notice-list {
  padding-left: 18px;
  color: #64748b;
  font-size: 13px;
  line-height: 2;
}

.comment-card {
  margin-top: 24px;
}

.empty-comment {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
}
</style>