<template>
  <div class="user-layout">
    <UserHeader />
    
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import UserHeader from '@/components/layout/UserHeader.vue'
</script>

<style scoped>
/* .user-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
} */

.content-wrapper {
  flex: 1;
}
</style>
