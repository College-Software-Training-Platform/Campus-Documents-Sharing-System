<template>
  <div class="login-container">
    <div class="login-card" style="padding: 50px 40px; text-align: center;">
      <div class="header-section">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#F56C6C">
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
          </svg>
        </div>
        <div class="art-title">登录失败</div>
        <div class="subtitle">您的身份验证未通过。</div>
      </div>
      <el-button class="btn-outline" @click="goBack">
        返回并重新尝试
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
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
  margin-bottom: 24px;
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

/* 线框按钮 */
.btn-outline {
  width: 100%;
  padding: 0;
  height: 44px;
  background-color: transparent;
  color: #42A1FF;
  border: 1.5px solid #42A1FF;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.3s;
}
.btn-outline:hover {
  background-color: rgba(66, 161, 255, 0.05);
  border-color: #4E99F0;
  color: #4E99F0;
}
</style>
