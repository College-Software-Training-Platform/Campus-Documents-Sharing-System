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

    <el-dialog v-model="editDialogVisible" title="修改资源信息" width="450px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="资源格式">
          <el-input v-model="editForm.format" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  userId: [Number, String]
})

const list = ref([])
const loading = ref(false)

// 编辑相关的响应式数据
const editDialogVisible = ref(false)
const editLoading = ref(false)
const editForm = reactive({
  resource_ID: '',
  title: '',
  format: ''
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) ? date.toLocaleString() : dateStr
}

// 1. 获取列表数据
const fetchData = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const res = await request.get('/users/resources', {
      params: { userId: props.userId }
    })
    if (res.code === 200) {
      list.value = Array.isArray(res.data) ? res.data : []
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取上传列表失败')
  } finally {
    loading.value = false
  }
}

// 2. 核心功能：处理积分下载
const handleDownload = async (row) => {
  if (!props.userId) {
    ElMessage.warning('用户信息未加载，请稍候')
    return
  }

  try {
    const response = await request.post('/users/download-action', {
      resourceId: row.resource_ID
    }, { 
      responseType: 'blob' 
    })

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${row.title}.${row.format || 'bin'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('积分扣除成功，文件开始下载')
    fetchData()
  } catch (error) {
    handleBlobError(error)
  }
}

// 3. 核心功能：删除资料
const handleDelete = (row) => {
  //弹窗提示是否确认删除
  ElMessageBox.confirm(
    `确定要永久删除资源《${row.title}》吗？`,
    '高危操作提示',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await request.delete(`/resources/${row.resource_ID}`)
      if (res.code === 200) {
        ElMessage.success('资源已成功删除')
        fetchData() // 刷新列表
      }
    } catch (error) {
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    // 点击取消不执行任何操作
  })
}

// 4. 编辑功能：打开弹窗并回显
const handleEdit = (row) => {
  editForm.resource_ID = row.resource_ID
  editForm.title = row.title
  editForm.format = row.format
  editDialogVisible.value = true
}

// 5. 编辑功能：提交修改
const submitEdit = async () => {
  if (!editForm.title.trim()) return ElMessage.warning('名称不能为空')
  
  editLoading.value = true
  try {
    const res = await request.put(`/users/resources/${editForm.resource_ID}`, {
      title: editForm.title
    })
    if (res.code === 200) {
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      fetchData()
    }
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    editLoading.value = false
  }
}

// Blob 错误解析辅助函数
const handleBlobError = (error) => {
  if (error.response && error.response.data instanceof Blob) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result)
        ElMessage.error(result.message || '操作失败')
      } catch (e) {
        ElMessage.error('服务器响应异常')
      }
    }
    reader.readAsText(error.response.data)
  } else {
    ElMessage.error('网络错误或权限不足')
  }
}

watch(() => props.userId, (newVal) => {
  if (newVal) fetchData()
}, { immediate: true })

</script>

<style scoped>
.resource-tab-content {
  padding: 10px 0;
}
/* 让表格操作列的按钮间距更自然 */
.el-button + .el-button {
  margin-left: 12px;
}
</style>