<template>
  <div class="document-detail-page">
    <div class="breadcrumb">
      <el-icon><ArrowLeft /></el-icon> 返回
    </div>

    <el-row :gutter="24" class="main-content">
      <!-- 左侧内容区 -->
      <el-col :span="17">
        <el-card class="content-card" shadow="never">
          <DocDetailMain />
          <el-divider />
          <DocDetailComments />
        </el-card>
      </el-col>

      <!-- 右侧侧边栏 -->
      <el-col :span="7">
        <DocDetailSidebar />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import DocDetailMain from './components/DocDetailMain.vue'
import DocDetailComments from './components/DocDetailComments.vue'
import DocDetailSidebar from './components/DocDetailSidebar.vue'
</script>

<style scoped>
.document-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  min-height: 100vh;
  background-color: #f8fafc;
}

.breadcrumb {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
}

.breadcrumb .el-icon {
  margin-right: 4px;
}

.content-card {
  border-radius: 12px;
  border: none;
  padding: 10px;
}
</style>