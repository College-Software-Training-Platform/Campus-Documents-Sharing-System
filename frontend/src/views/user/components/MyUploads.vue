<template>
  <div class="resource-tab-content">
    <el-table :data="list" stripe v-loading="loading" style="width: 100%">
      <template #empty>
        <el-empty :description="userId ? '暂无上传资源' : '正在获取用户信息...'" />
      </template>

      <el-table-column prop="title" label="资源名称" min-width="200" show-overflow-tooltip />
      
      <el-table-column label="类型" width="100">
        <template #default="scope">
          <el-tag size="small" effect="light">
            {{ scope.row.format || '未知' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="download_Count" label="下载次数" width="100" align="center" />
      
      <el-table-column label="上传时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.upload_Time) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  userId: [Number, String]
})

const list = ref([])
const loading = ref(false)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) ? date.toLocaleString() : dateStr
}

const fetchData = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const res = await axios.get('http://localhost:3000/api/users/resources', {
      params: { userId: props.userId }
    })
    
    console.log('--- 后端返回原始数据 ---', res.data)
    
    if (res.data.code === 200) {
      // 重点：有些后端返回的是 res.data.data，有些是 res.data.data.list
      // 这里根据你之前的统计数据能显示，假设数据就在 res.data.data 里
      list.value = Array.isArray(res.data.data) ? res.data.data : []
      console.log('--- 赋值给表格的数据 ---', list.value)
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取上传列表失败')
  } finally {
    loading.value = false
  }
}

watch(() => props.userId, (newVal) => {
  if (newVal) fetchData()
}, { immediate: true })

const handleDelete = (row) => { ElMessage.warning('删除功能开发中...') }
const handleEdit = (row) => { ElMessage.info('编辑功能开发中...') }
</script>

<style scoped>
.resource-tab-content {
  padding: 10px 0;
}
</style>