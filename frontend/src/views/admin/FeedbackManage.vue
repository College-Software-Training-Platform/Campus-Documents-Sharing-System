<template>
    <!-- 管理端-用户反馈页 -->
  <div class="feedback-manage">
    <h2>用户反馈管理</h2>

    <!-- 搜索栏 -->
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索反馈内容"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
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
import { ElMessage } from 'element-plus'

const feedbackList = ref([])
const total = ref(0)
const keyword = ref('')

// 模拟数据（后面换接口）
const fetchFeedbacks = () => {
  feedbackList.value = [
    {
      id: 1,
      username: 'user1',
      content: '这个资源打不开',
      status: '未处理'
    },
    {
      id: 2,
      username: 'user2',
      content: '希望增加更多课程资料',
      status: '已处理'
    }
  ]
  total.value = 2
}

// 搜索
const handleSearch = () => {
  console.log('搜索:', keyword.value)
  fetchFeedbacks()
}

// 标记处理
const handleProcess = (row) => {
  row.status = '已处理'
  ElMessage.success('已标记为处理')
}

// 删除
const handleDelete = (row) => {
  console.log('删除反馈:', row)
  ElMessage.success('删除成功')
}

// 分页
const handlePageChange = (page) => {
  console.log('页码:', page)
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