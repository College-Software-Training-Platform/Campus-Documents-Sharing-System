<template>
  <div class="resource-tab-content">
    <el-table :data="list" stripe v-loading="loading" style="width: 100%">
      <template #empty>
        <el-empty description="暂无下载记录" />
      </template>

      <el-table-column prop="title" label="资源名称" min-width="200" show-overflow-tooltip />
      
      <el-table-column label="消耗积分" width="120" align="center">
        <template #default="scope">
          <span style="color: #f56c6c">-{{ scope.row.deducted_Points }} 积分</span>
        </template>
      </el-table-column>

      <el-table-column label="下载时间" width="200">
        <template #default="scope">
          {{ formatDate(scope.row.download_Time) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button link type="primary">再次下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const props = defineProps({
  userId: [Number, String]
})

const list = ref([])
const loading = ref(false)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const fetchDownloads = async () => {
  loading.value = true
  try {
    const res = await request.get('/users/downloads', {
      params: { userId: props.userId }
    })
    if (res.code === 200) {
      list.value = res.data
    }
  } catch (error) {
    console.error('获取下载记录失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDownloads()
})
</script>