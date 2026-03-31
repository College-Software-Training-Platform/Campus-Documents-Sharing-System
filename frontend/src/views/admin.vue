<template>
  <div class="app-container">
    <!-- 侧边栏作为复用组件 -->
    <AdminSidebar />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
</script>

<style scoped>
:root {
  --sidebar-width: 240px;
  --bg-color: #f8fafc;
  --primary-blue: #3b82f6;
  --text-main: #1e293b;
  --text-secondary: #64748b;
  --card-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
}

* {
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.app-container {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
  min-width: 1000px;
  background-color: #f8fafc;
  color: #1e293b;
  margin: 0;
  padding: 0;
}

.main-content {
  padding: 24px 32px;
  display: grid;
  gap: 24px;
  align-content: start;
}
</style>
