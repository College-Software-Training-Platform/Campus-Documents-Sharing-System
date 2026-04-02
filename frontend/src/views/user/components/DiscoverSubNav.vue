<template>
  <div class="discover-sub-nav">
    <div class="nav-container">
      <div 
        v-for="item in navItems" 
        :key="item.path"
        :class="['nav-item', { active: currentPath === item.path }]"
        @click="goTo(item.path)"
      >
        <span class="nav-icon"></span>
        <span class="nav-label">{{ item.label }}</span>
        <div class="active-indicator" v-if="currentPath === item.path"></div>
      </div>
    </div>
    
    <div class="view-actions">
      <el-tooltip content="网格视图" placement="top">
        <el-button circle size="small">▦</el-button>
      </el-tooltip>
      <el-tooltip content="列表视图" placement="top">
        <el-button circle size="small">☰</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '趋势', path: '/user/DiscoverTrend'},
  { label: '标签', path: '/user/DiscoverTag'}
]

const currentPath = computed(() => route.path)

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.discover-sub-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #edf2f7;
}

.nav-container {
  display: flex;
  gap: 32px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #718096;
}

.nav-item:hover {
  color: #3182ce;
}

.nav-item.active {
  color: #409EFF;
  font-weight: 600;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  font-size: 16px;
  letter-spacing: 0.5px;
}

.active-indicator {
  position: absolute;
  bottom: -11px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4299e1, #3182ce);
  border-radius: 3px 3px 0 0;
}

.view-actions {
  display: flex;
  gap: 12px;
}
</style>
