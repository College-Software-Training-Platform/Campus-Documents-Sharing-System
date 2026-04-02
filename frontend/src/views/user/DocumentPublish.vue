<template>
  <div class="document-publish">
    <div class="publish-header">
      <div class="title-with-action">
        <button class="exit-btn" @click="goBack" title="返回发现页">
          <img src="@/assets/icon/chevron_left.svg" alt="Back" class="icon" />
        </button>
        <h1 class="page-title">发布资源</h1>
      </div>
      <p class="page-subtitle">分享您的知识财富，赚取积分报酬</p>
    </div>
    
    <el-row :gutter="24">
      <!-- 左侧主表单 -->
      <el-col :lg="17" :md="24">
        <DocPublishMain />
      </el-col>
      <!-- 右侧注意事项侧边栏 -->
      <el-col :lg="7" :md="24">
        <DocPublishSidebar />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DocPublishMain from './components/DocPublishMain.vue'
import DocPublishSidebar from './components/DocPublishSidebar.vue'

const router = useRouter()

const goBack = () => {
  // 跳转到发现页
  router.push('/user/DiscoverTrend')
}
</script>

<style scoped>
.document-publish {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.publish-header {
  margin-bottom: 30px;
}

.title-with-action {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.exit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.exit-btn:hover {
  background-color: #f1f5f9;
}

.exit-btn .icon {
  width: 20px;
  height: 20px;
  filter: grayscale(1);
  opacity: 0.7;
}

.exit-btn:hover .icon {
  opacity: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  padding-left: 48px;
}
</style>