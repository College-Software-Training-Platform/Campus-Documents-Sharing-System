<template>
  <div>
    <!-- 标签与标题 -->
    <div class="header-section">
      <div class="tags">
        <CommonTag :text="resource?.course || '未分类'" />
        <CommonTag text="热门资源" />
      </div>
      <h1 class="doc-title">{{ resource?.title || '资源加载中...' }}</h1>
      <div class="meta-info">
        <span class="meta-item"><el-icon><Calendar /></el-icon> 发布于 {{ formatDate(resource?.upload_Time) }}</span>
        <span class="meta-item"><el-icon><View /></el-icon> {{ resource?.download_Count || 0 }} 次浏览</span>
        <span class="meta-item rating"><el-icon color="#f59e0b"><StarFilled /></el-icon> 5.0 <span class="rating-count">(已审核)</span></span>
      </div>
    </div>

    <!-- 封面图预览 -->
    <div class="cover-preview">
      <div class="cover-placeholder" :class="resource?.format">
        <h2>{{ resource?.course?.course_Name || 'Campus' }}</h2>
        <h2>{{ resource?.format?.toUpperCase() || 'FILE' }}</h2>
        <el-button round class="preview-btn"><el-icon><FullScreen /></el-icon> 资源预览</el-button>
      </div>
    </div>


    <!-- 摘要 -->
    <div class="detail-description">
      <h3 class="section-title"><span class="title-indicator"></span> 摘要 (AI 自动生成)</h3>
      <div class="desc-content">
        {{ resource?.ai_Summary || resource?.description || '暂无详细摘要' }}
      </div>
      <div class="hash-tags">
        <CommonTag 
          v-for="tag in resource?.tags" 
          :key="tag.tag_Name" 
          :text="'#' + tag.tag_Name" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Calendar, View, StarFilled, FullScreen
} from '@element-plus/icons-vue'
import { computed, onMounted } from 'vue'
import { useResourceStore } from '@/store/resource'
import CommonTag from './CommonTag.vue'

const props = defineProps({
  resourceId: {
    type: [String, Number],
    required: true
  }
})

const resourceStore = useResourceStore()
const resource = computed(() => resourceStore.currentResource)

const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
  resourceStore.fetchResourceById(props.resourceId)
})
</script>

<style scoped>
/* Header */
.header-section {
  margin-bottom: 24px;
}

.tags {
  margin-bottom: 12px;
}

.custom-tag {
  border-radius: 4px;
  margin-right: 8px;
  font-weight: 500;
}

.doc-title {
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #64748b;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating {
  color: #0f172a;
  font-weight: 600;
}

.rating-count {
  font-weight: normal;
  color: #94a3b8;
}

/* Cover Preview */
.cover-preview {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 40px;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.cover-placeholder {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, #7dd3fc, #38bdf8);
  aspect-ratio: 3/4;
  border-radius: 4px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  border: 10px solid white;
}

.cover-placeholder h2 {
  margin: 5px 0;
  font-size: 24px;
}

.preview-btn {
  position: absolute;
  bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #334155;
  border: none;
}

/* AI Summary */
.ai-summary {
  background: linear-gradient(to right, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.ai-title {
  color: #0ea5e9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.ai-text {
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Description */
.section-title {
  font-size: 18px;
  color: #0f172a;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.title-indicator {
  width: 4px;
  height: 18px;
  background-color: #3b82f6;
  border-radius: 2px;
  margin-right: 8px;
}

.desc-content {
  color: #475569;
  font-size: 15px;
  line-height: 1.8;
}

.desc-content ul {
  padding-left: 20px;
  margin-top: 10px;
}

.desc-content li {
  margin-bottom: 8px;
}

.hash-tags {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.hash-tag {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
  border-radius: 4px;
}
</style>
