<template>
  <div class="login-container">
    <div class="login-card" style="padding: 60px 40px; text-align: center;">
      <div class="header-section" style="margin-bottom: 0;">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#67C23A">
            <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
          </svg>
        </div>
        <div class="art-title">登录成功</div>
        <div class="subtitle">欢迎回来，即将为您跳转主页...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 3秒后自动返回主界面，仅做界面展示模拟
  setTimeout(() => {
    // router.push('/')
  }, 3000)
})
</script>

<style scoped>
/* 全屏背景及居中 */
.login-container {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 卡片样式 */
.login-card {
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 400px;
  box-sizing: border-box;
}

/* 头部 */
.header-section {
  text-align: center;
}
.header-icon {
  margin-bottom: 12px;
}
.art-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}
.subtitle {
  color: #909399;
  font-size: 13px;
  margin: 0;
}
</style>
