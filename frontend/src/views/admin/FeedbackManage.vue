<template>
  <div class="feedback-manage">
    <h2>用户反馈管理</h2>

    <!-- 搜索 -->
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索反馈内容" style="width: 200px" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="feedbackList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户" />
      <el-table-column prop="content" label="反馈内容" />
      <el-table-column prop="status" label="状态" />

      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            @click="handleProcess(scope.row)"
          >
            标记已处理
          </el-button>

          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const feedbackList = ref([])
const total = ref(0)
const keyword = ref('')

// ✅ 获取反馈（连接后端）
const fetchFeedbacks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/feedbacks')

    // ⚠️ 映射字段（根据你数据库来）
    feedbackList.value = res.data.map(item => ({
      id: item.feedback_ID,
      username: item.user_ID,     // 或用户名字段
      content: item.content,
      status: item.status === 'processed' ? '已处理' : '未处理'
    }))

    total.value = feedbackList.value.length

  } catch (err) {
    console.error(err)
    ElMessage.error('获取反馈失败')
  }
}

// 🔍 搜索（前端过滤）
const handleSearch = () => {
  if (!keyword.value) {
    fetchFeedbacks()
    return
  }

  feedbackList.value = feedbackList.value.filter(item =>
    item.content.includes(keyword.value)
  )
}

// ✅ 标记已处理（调用后端）
const handleProcess = async (row) => {
  try {
    await axios.put(`http://localhost:3000/api/feedbacks/${row.id}`)

    ElMessage.success('已标记为处理')
    fetchFeedbacks()

  } catch (err) {
    console.error(err)
    ElMessage.error('操作失败')
  }
}

// ✅ 删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`http://localhost:3000/api/feedbacks/${row.id}`)

    ElMessage.success('删除成功')
    fetchFeedbacks()

  } catch (err) {
    console.error(err)
    ElMessage.error('删除失败')
  }
}

// 分页（简单刷新）
const handlePageChange = () => {
  fetchFeedbacks()
}

onMounted(() => {
  fetchFeedbacks()
})
</script>

<style scoped>
.feedback-manage {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>