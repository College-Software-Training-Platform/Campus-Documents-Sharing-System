<template>
  <div class="header">
    <div class="nav-left">
      <div class="logo" @click="router.push('/')" style="cursor: pointer;">智慧校园资料共享</div>
      <div class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/user/DiscoverTag">发现</router-link>
      </div>
    </div>
    <!-- 使用 Element Plus input 替换原生 -->
    <el-input 
      v-model="searchQuery"
      class="search-wrapper"
      placeholder="搜索学术资源、论文、课件..." 
      @keyup.enter="onSearch"
    />
    <div class="nav-right">
      <div class="badge">{{ user?.points_Balance ?? 0 }}</div>
      <div style="cursor: pointer; font-size: 18px;">🔔</div>
      
      <!-- 头像下拉菜单 -->
      <el-dropdown trigger="hover" @command="handleCommand">
        <div class="avatar-container" @click="router.push('/user/Profile')">
          <div class="avatar" :style="{ backgroundImage: `url(${user?.avatar_Url})` }"></div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="user-info-dropdown">
              <div class="username">{{ user?.name || '未登录' }}</div>
              <div class="account">{{ user?.account }}</div>
            </div>
            <el-dropdown-item divided command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout" class="logout-item">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

const onSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/user/SearchResult',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'profile') {
    router.push('/user/Profile')
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.success('已安全退出')
    // 重定向到登录页
    router.push('/auth/login')
  }).catch(() => {})
}

// 刷新用户信息 (如果需要的话，可以在这里调用后端 API)
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})
</script>

<style scoped>
/* 交互风格 */
a {
  text-decoration: none;
  color: #409eff;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .05);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-weight: bold;
  font-size: 18px;
}

.nav a {
  margin-right: 15px;
}

/* 搜索框替换样式 */
.search-wrapper {
  width: 300px;
}
.search-wrapper :deep(.el-input__wrapper) {
  border-radius: 20px;
  box-shadow: 0 0 0 1px #ddd inset;
}
.search-wrapper :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 积分框 */
.badge {
  background: #409eff;
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
}

/* 头像 */
.avatar-container {
  cursor: pointer;
  outline: none;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  border: 1px solid #f0f0f0;
}

/* 下拉菜单用户信息 */
.user-info-dropdown {
  padding: 10px 15px;
  min-width: 120px;
}
.username {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}
.account {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.logout-item {
  color: #f56c6c !important;
}
</style>
