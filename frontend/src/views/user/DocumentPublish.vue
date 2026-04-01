<template>
  <div class="publish-page-container">
    <div class="publish-header">
      <h1 class="page-title">发布资源</h1>
      <p class="page-subtitle">分享您的知识财富，赚取积分报酬</p>
    </div>
    
    <div class="publish-content">
      <DocPublishMain />
    </div>
  </div>
</template>

<script setup>
import DocPublishMain from './components/DocPublishMain.vue'
</script>

<style scoped>
.publish-page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.publish-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
}

.publish-content {
  background-color: transparent;
}
</style>