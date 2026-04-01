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
      <div class="badge">100</div>
      <div style="cursor: pointer; font-size: 18px;">🔔</div>
      <div class="avatar" @click="router.push('/user/Profile')" style="cursor: pointer;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const onSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/user/SearchResult',
      query: { q: searchQuery.value.trim() }
    })
  }
}
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
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ccc;
}
</style>
