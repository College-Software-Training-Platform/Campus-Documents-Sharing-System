<template>
  <div class="header">
    <div class="nav-left">
      <div class="logo">智慧校园</div>
      <div class="nav">
        <a href="#">首页</a>
        <a href="#">发现</a>
      </div>
    </div>
    <!-- 使用 Element Plus input 替换原生 -->
    <el-input 
      v-model="searchQuery"
      class="search-wrapper"
      placeholder="搜索学术资源..." 
    />
    <div class="nav-right">
      <div class="badge">100</div>
      <div style="cursor: pointer; font-size: 18px;">🔔</div>
      <div class="avatar"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
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
