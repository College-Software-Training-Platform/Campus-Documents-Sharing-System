<template>
  <div class="resource-manage">
    <div class="stats-row">
      <el-statistic title="已上传" :value="uploadCount" />
      <el-statistic title="已下载" :value="downloadCount" style="margin-left: 50px" />
    </div>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px">
      <el-table-column prop="title" label="资源名称" min-width="200" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="uploadDate" label="日期" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" link type="primary">查看</el-button>
          <el-button size="small" link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const uploadCount = ref(12)
const downloadCount = ref(45)
const tableData = ref([
  { title: '操作系统期末复习.pdf', category: '课件', uploadDate: '2026-03-01' },
  { title: '离散数学真题集.zip', category: '真题', uploadDate: '2026-03-15' }
])
</script>