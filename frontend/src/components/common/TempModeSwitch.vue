<template>
  <!-- 临时的端切换悬浮按钮 -->
  <el-button 
    type="warning" 
    class="temp-switch-btn" 
    @click="toggleMode"
    round
  >
    切换到{{ isUserSide ? '管理端' : '用户端' }}
  </el-button>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 判断当前是否在用户端（根据路径是否包含 /admin）
const isUserSide = computed(() => {
  return !route.path.startsWith('/admin')
})

const toggleMode = () => {
  if (isUserSide.value) {
    // 如果在用户端，跳转到管理端首页
    router.push('/admin')
  } else {
    // 如果在管理端，跳转回用户端首页
    router.push('/')
  }
}
</script>

<style scoped>
/* 临时切换按钮样式 */
.temp-switch-btn {
  position: fixed !important;
  bottom: 24px;
  left: 24px;
  right: auto;
  z-index: 9000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
