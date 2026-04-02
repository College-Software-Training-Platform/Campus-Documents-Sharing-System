<template>
  <div class="sidebar-container">
    <!-- 下载信息卡片 -->
    <el-card class="sidebar-card download-card" shadow="never">
      <div class="doc-file-info">
        <img src="@/assets/icon/pdf.svg" alt="pdf" class="file-icon" />
        <div class="file-details">
          <h4>{{ resource?.title || '资源加载中...' }}</h4>
          <span>12.8 MB · 共 45 页</span>
        </div>
      </div>
      
      <div class="points-info">
        <span class="label">下载所需积分</span>
        <span class="value"><el-icon><Coin /></el-icon> {{ resource?.required_Points || 0 }}</span>
      </div>
      <div class="points-desc">下载后永久免费，支持全平台阅读</div>
      
      <el-button type="primary" size="large" class="download-btn">
        <el-icon><Download /></el-icon> 立即下载
      </el-button>
    </el-card>

    <!-- 作者信息卡片 -->
    <el-card class="sidebar-card author-card" shadow="never">
      <div class="author-header">
        <el-avatar :size="50" :src="resource?.uploader?.avatar_Url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
        <div class="author-details">
          <h4>{{ resource?.uploader?.name || '未知用户' }}</h4>
          <span>{{ resource?.course?.college || '校友' }}</span>
        </div>
        <el-button class="follow-btn" type="primary" plain size="small">关注</el-button>
      </div>
      <div class="author-stats">
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">上传资源</span>
        </div>
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">获赞</span>
        </div>
      </div>
    </el-card>

    <!-- 相关推荐卡片 -->
    <el-card class="sidebar-card recommend-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>相关资源推荐</span>
        </div>
      </template>
      
      <div class="recommend-list">
        <div class="recommend-item" v-for="i in 3" :key="i">
          <div class="rect-cover"></div>
          <div class="recommend-info">
            <h5 class="text-ellipsis">推荐资源正在加载...</h5>
            <div class="recommend-meta">
              <span><el-icon><Download /></el-icon> --</span>
              <span class="recommend-points"><el-icon><Coin /></el-icon> --</span>
            </div>
          </div>
        </div>
      </div>
      <div class="view-all-recommend">
        <el-button text class="full-width">查看更多推荐</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Coin, Download } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useResourceStore } from '@/store/resource'

const props = defineProps({
  resourceId: {
    type: [String, Number],
    required: true
  }
})

const resourceStore = useResourceStore()
const resource = computed(() => resourceStore.currentResource)
</script>

<style scoped>
.sidebar-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 20px;
}

/* Download Card */
.download-card {
  background-color: #ffffff;
}

.doc-file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.file-icon {
  width: 48px;
  height: 48px;
}

.file-details h4 {
  margin: 0 0 4px 0;
  color: #0f172a;
  font-size: 15px;
}

.file-details span {
  font-size: 12px;
  color: #64748b;
}

.points-info {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.points-info .label {
  color: #64748b;
  font-size: 14px;
}

.points-info .value {
  color: #3b82f6;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.points-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.download-btn {
  width: 100%;
  border-radius: 8px;
}

/* Author Card */
.author-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.author-details {
  flex: 1;
}

.author-details h4 {
  margin: 0 0 4px 0;
  color: #0f172a;
  font-size: 15px;
}

.author-details span {
  font-size: 12px;
  color: #64748b;
}

.follow-btn {
  border-radius: 16px;
}

.author-stats {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-item .count {
  font-weight: 600;
  color: #0f172a;
  font-size: 16px;
}

.stat-item .label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* Recommend Card */
.card-header span {
  font-weight: 600;
  color: #0f172a;
}

.recommend-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.rect-cover {
  width: 60px;
  height: 80px;
  background-color: #cbd5e1;
  border-radius: 4px;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}

.text-ellipsis {
  margin: 0;
  font-size: 13px;
  color: #334155;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
}

.recommend-points {
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 2px;
}

.full-width {
  width: 100%;
}
</style>
