<template>
  <div class="discover-trend">
    <DiscoverSubNav />

    <div class="trend-container">
      <div class="header-section">
        <h1>发现趋势</h1>
        <p>探索校园最热门的学术资源</p>
      </div>

      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="course-list-row">
        <ResourceCard 
          v-for="item in displayResources" 
          :key="item.resourceId" 
          :item="formatItem(item)" 
        />
      </div>

      <!-- 空状态展示 -->
      <div v-if="displayResources.length === 0 && !resourceStore.discoverTrend.loading" class="empty-state">
        <el-empty description="暂无热门资源，快去发布吧" />
      </div>
    </div>

    <button class="publish-fab" @click="goPublish" title="发布资料">
      +
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DiscoverSubNav from './components/DiscoverSubNav.vue'
import ResourceCard from './components/ResourceCard.vue'
import { useResourceStore } from '@/store/resource'

const router = useRouter()
const resourceStore = useResourceStore()

const filterTabs = [
  { id: 'all', label: '全部' },
  { id: 'pdf', label: 'PDF' },
  { id: 'docx', label: '文档' },
  { id: 'zip', label: '压缩包' }
]
const activeTab = ref('all')

const displayResources = computed(() => {
  return resourceStore.discoverTrend.data
})

const formatItem = (item) => {
  return {
    resourceId: item.resourceId || item.resource_ID,
    title: item.title,
    uploader: item.uploader?.name || item.uploader || '匿名用户',
    price: item.required_Points !== undefined ? item.required_Points : (item.points || 0),
    format: item.format,
    downloadCount: item.download_Count || 0
  }
}

onMounted(() => {
  fetchData()
})

const fetchData = () => {
  resourceStore.fetchDiscoverTrend({ format: activeTab.value, sort: 'hottest', page: 1, limit: 10 })
}

watch(activeTab, () => {
  fetchData()
})

const goPublish = () => {
  router.push('/user/DocumentPublish')
}
</script>

<style scoped>
.discover-trend { 
  min-height: 100vh; 
  background: #f8fafc; 
  padding: 10px 40px 40px; 
  position: relative; 
}
.trend-container { 
  width: 100%; 
  max-width: 1280px; 
  margin: 0 auto; 
}
.header-section { 
  text-align: left; 
  margin-bottom: 24px; 
  border-left: 4px solid #3182ce; 
  padding-left: 16px; 
}
.header-section h1 { 
  margin: 0 0 4px; 
  color: #1a202c; 
  font-size: 24px; 
}
.header-section p { 
  margin: 0; 
  color: #4a5568; 
  font-size: 14px; 
}
.filter-tabs { 
  display: flex; 
  gap: 10px; 
  justify-content: flex-start; 
  flex-wrap: wrap; 
  margin-bottom: 24px; 
}
.tab-btn { 
  border: 1px solid #d9e2f2; 
  border-radius: 999px; 
  padding: 7px 16px; 
  background: #fff; 
  cursor: pointer; 
  transition: all 0.2s ease;
  font-size: 14px;
}
.tab-btn.active { 
  background: #3182ce; 
  border-color: #3182ce; 
  color: #fff; 
}

.course-list-row {
  display: grid;
  /* 使用 auto-fill 实现真正的自动换行 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.empty-state {
  margin-top: 60px;
  text-align: center;
}

.publish-fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ba2ff, #2d86f7);
  color: #fff;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(45, 134, 247, 0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.publish-fab:hover {
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .discover-trend {
    padding: 10px 20px 40px;
  }
  .course-list-row {
    grid-template-columns: 1fr;
  }
}
</style>
