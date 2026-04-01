<template>
  <div class="document-publish">
    <div class="publish-header">
      <h1 class="page-title">发布资源</h1>
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
import DocPublishMain from './components/DocPublishMain.vue'
import DocPublishSidebar from './components/DocPublishSidebar.vue'
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

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 适配移动端 */
@media (max-width: 1200px) {
  .el-col {
    margin-bottom: 24px;
  }
}
</style>