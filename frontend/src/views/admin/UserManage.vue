<template>
  <div class="user-manage">
    <h2>用户管理</h2>

    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名/学号"
        style="width: 200px"
        clearable
      />
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
    </div>

    <el-table :data="userList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="account" label="学号" />
      <el-table-column prop="email" label="联系方式" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
            {{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>

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

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      @current-change="handlePageChange"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const userList = ref([])
const total = ref(0)
const keyword = ref('')
const loading = ref(false)

// 获取用户列表（适配后端的 { code: 200, data: [] } 格式）
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      'http://localhost:3000/api/users',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )

    if (res.data.code === 200 && Array.isArray(res.data.data)) {
      const rawData = res.data.data
      
      userList.value = rawData.map(item => ({
        id: item.user_ID,
        username: item.name || '未设置',
        account: item.account,
        email: item.contact,
        role: item.role
      }))

      total.value = userList.value.length
    } else {
      ElMessage.error('数据格式错误')
    }
  } catch (error) {
    console.error('获取用户失败:', error)
    ElMessage.error('未登录或权限不足')
  } finally {
    loading.value = false
  }
}

// 搜索（基于当前列表过滤）
const handleSearch = () => {
  if (!keyword.value) {
    fetchUsers()
    return
  }
  userList.value = userList.value.filter(user =>
    user.username.includes(keyword.value) || user.account.includes(keyword.value)
  )
}

const token = localStorage.getItem('token')

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${row.username} 吗？`,
      '提示',
      { type: 'warning' }
    )

    await axios.delete(
      `http://localhost:3000/api/users/${row.id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )

    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败（可能未登录或权限不足）')
  }
}

// 封禁用户
const handleBan = async (row) => {
  try {
    await axios.put(
      `http://localhost:3000/api/users/${row.id}/ban`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )

    ElMessage.success('封禁成功')
    fetchUsers()
  } catch (error) {
    console.error('封禁失败:', error)
    ElMessage.error('封禁失败（可能未登录或权限不足）')
  }
}

//  分页处理
const handlePageChange = (val) => {
  console.log(`当前页: ${val}`)
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-manage {
  padding: 20px;
  background: #fff;
  min-height: 100vh;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>