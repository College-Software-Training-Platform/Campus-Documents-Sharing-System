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
import axios from 'axios'

const userList = ref([])
const total = ref(0)
const keyword = ref('')

// ✅ 获取用户（已连接后端）
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users')

    userList.value = res.data.map(item => ({
      id: item.user_ID,
      username: item.account,
      email: item.contact,
      role: item.role
    }))

    total.value = userList.value.length
  } catch (error) {
    console.error('获取用户失败:', error)
  }
}

// 🔍 搜索（前端简单过滤）
const handleSearch = () => {
  if (!keyword.value) {
    fetchUsers()
    return
  }

  userList.value = userList.value.filter(user =>
    user.username.includes(keyword.value)
  )
}

// 🗑 删除用户
const handleDelete = async (row) => {
  try {
    await axios.delete(`http://localhost:3000/api/users/${row.id}`)
    fetchUsers() // 删除后刷新
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 🚫 封禁用户
const handleBan = async (row) => {
  try {
    await axios.put(`http://localhost:3000/api/users/${row.id}/ban`)
    fetchUsers() // 更新后刷新
  } catch (error) {
    console.error('封禁失败:', error)
  }
}

// 📄 分页（简单处理）
const handlePageChange = () => {
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