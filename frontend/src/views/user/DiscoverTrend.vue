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
          :item="{ ...item, price: item.points }"
        />
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
  const data = resourceStore.discoverTrend.data.length
    ? resourceStore.discoverTrend.data
    : resourceStore.resources

  return data.slice(0, 4).map((item) => ({
    ...item,
    resourceId: item.resourceId || item.resource_ID,
    points: item.points ?? item.required_Points ?? 0
  }))
})

onMounted(() => {
  resourceStore.fetchDiscoverTrend({ format: activeTab.value, sort: 'hottest', page: 1, limit: 10 })
})

watch(activeTab, (format) => {
  resourceStore.fetchDiscoverTrend({ format, sort: 'hottest', page: 1, limit: 10 })
})

const goPublish = () => {
  router.push('/user/DocumentPublish')
}
</script>

<style scoped>
.discover-trend { min-height: 100vh; background: #f8fafc; padding: 10px 40px 40px; position: relative; }
.trend-container { width: 100%; max-width: 1280px; margin: 0 auto; }
.header-section { text-align: left; margin-bottom: 24px; border-left: 4px solid #3182ce; padding-left: 16px; }
.header-section h1 { margin: 0 0 4px; color: #1a202c; font-size: 24px; }
.header-section p { margin: 0; color: #4a5568; font-size: 14px; }
.filter-tabs { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px; }
.tab-btn { border: 1px solid #d9e2f2; border-radius: 999px; padding: 7px 13px; background: #fff; cursor: pointer; }
.tab-btn.active { background: #409eff; border-color: #409eff; color: #fff; }
.course-list-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .course-list-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .course-list-row {
    grid-template-columns: 1fr;
  }
}
.publish-fab {
  position: fixed;
  right: 24px;
  bottom: 22px;
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
  z-index: 10000;
}
@media (max-width: 900px) {
  .trend-chart { grid-template-columns: 1fr; }
}
</style>
