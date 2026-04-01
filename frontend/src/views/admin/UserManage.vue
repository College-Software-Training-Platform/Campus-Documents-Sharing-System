<template>
  <!-- 管理端-用户管理 -->
  <div class="user-manage">
    <h2>用户管理</h2>

    <!-- 搜索栏 -->
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" />

      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>

          <el-button
            type="warning"
            size="small"
            @click="handleBan(scope.row)"
          >
            封禁
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

// 模拟数据（后面换成接口）
const userList = ref([])
const total = ref(0)
const keyword = ref('')

// 加载用户数据
const fetchUsers = () => {
  // 这里后面换成 axios 请求
  userList.value = [
    { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' },
    { id: 2, username: 'user1', email: 'user1@test.com', role: 'user' }
  ]
  total.value = 2
}

// 搜索
const handleSearch = () => {
  console.log('搜索:', keyword.value)
  fetchUsers()
}

// 删除用户
const handleDelete = (row) => {
  console.log('删除用户:', row)
}

// 封禁用户
const handleBan = (row) => {
  console.log('封禁用户:', row)
}

// 分页
const handlePageChange = (page) => {
  console.log('当前页:', page)
  fetchUsers()
}

// 页面加载
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-manage {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>