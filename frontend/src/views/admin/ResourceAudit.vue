<template>
  <div class="resource-audit">
    <h3>资源审核管理</h3>
    
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="资源标题">
          <el-input v-model="filterForm.title" placeholder="输入关键词" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="审核状态" style="width: 120px">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="resource_ID" label="ID" width="70" />
      <el-table-column prop="title" label="资源名称" min-width="180" />
      <el-table-column prop="uploader_ID" label="上传者ID" width="100" />
      <el-table-column prop="upload_Time" label="上传时间" width="180" />
      <el-table-column prop="required_Points" label="所需积分" width="100" />
      
      <el-table-column label="当前状态" width="100">
        <template #default="scope">
          <el-tag :type="statusMap[scope.row.audit_Status].tag">
            {{ statusMap[scope.row.audit_Status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-button 
            v-if="scope.row.audit_Status === 'pending'"
            type="success" 
            size="small" 
            @click="handleAudit(scope.row, 'approved')"
          >通过</el-button>
          <el-button 
            v-if="scope.row.audit_Status === 'pending'"
            type="danger" 
            size="small" 
            @click="handleAudit(scope.row, 'rejected')"
          >驳回</el-button>
          <el-button type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const loading = ref(false)
const tableData = ref([])

// 筛选表单
const filterForm = reactive({
  title: '',
  status: 'pending'
})

// 状态映射
const statusMap = {
  pending: { text: '待审核', tag: 'warning' },
  approved: { text: '已通过', tag: 'success' },
  rejected: { text: '已驳回', tag: 'danger' }
}

// 获取列表（直接对接后端接口）
const fetchList = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:3000/api/resources/pending')
    // 后端返回数组
    tableData.value = res.data.map(item => ({
      ...item,
      audit_Status: item.audit_Status || item.audit_Status // 确保字段正确
    }))
  } catch (err) {
    ElMessage.error('获取列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 审核操作
const handleAudit = (row, status) => {
  const actionText = status === 'approved' ? '通过' : '驳回'
  ElMessageBox.confirm(`确定要${actionText}资源《${row.title}》吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: status === 'approved' ? 'success' : 'warning'
  }).then(async () => {
    try {
      await axios.put(`http://localhost:3000/api/resources/${row.resource_ID}/audit`, {
        status
      })
      ElMessage.success('操作成功')
      fetchList()
    } catch (err) {
      console.error(err)
      ElMessage.error('操作失败')
    }
  })
}

// 查看详情（打开文件路径）
const viewDetail = (row) => {
  window.open(row.file_Path, '_blank')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.resource-audit {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}
</style>