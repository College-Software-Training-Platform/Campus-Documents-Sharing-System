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

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="handleDownload(scope.row)">下载测试</el-button>
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

// 获取列表数据
const fetchData = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const res = await axios.get('http://localhost:3000/api/users/resources', {
      params: { userId: props.userId }
    })
    
    if (res.data.code === 200) {
      list.value = Array.isArray(res.data.data) ? res.data.data : []
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取上传列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * ✅ 核心功能：处理积分下载
 */
const handleDownload = async (row) => {
  if (!props.userId) {
    ElMessage.warning('用户信息未加载，请稍候')
    return
  }

  try {
    // 1. 调用后端下载动作接口
    // 注意：必须设置 responseType 为 'blob' 才能接收文件流
    const response = await axios.post('http://localhost:3000/api/users/download-action', {
      userId: props.userId,
      resourceId: row.resource_ID
    }, { 
      responseType: 'blob' 
    })

    // 2. 创建 Blob 对象并生成下载链接
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    
    // 3. 创建虚拟 A 标签触发浏览器下载
    const link = document.createElement('a')
    link.href = url
    // 拼接文件名：标题.格式
    link.setAttribute('download', `${row.title}.${row.format || 'bin'}`)
    document.body.appendChild(link)
    link.click()
    
    // 4. 下载后移除临时元素并释放内存
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('积分扣除成功，文件开始下载')
    
    // 5. 关键：重新拉取列表，更新页面显示的“下载次数”
    fetchData()

  } catch (error) {
    console.error('下载失败详情:', error)
    
    // 特殊处理：如果是 Blob 类型报错，需要读取其内部的 JSON 错误信息
    if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result)
          ElMessage.error(result.message || '下载失败')
        } catch (e) {
          ElMessage.error('积分不足或服务器资源丢失')
        }
      }
      reader.readAsText(error.response.data)
    } else {
      ElMessage.error('网络错误或服务器无响应')
    }
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