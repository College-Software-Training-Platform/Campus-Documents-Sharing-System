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
        <CourseCard 
          v-for="item in displayResources" 
          :key="item.resourceId" 
          :item="{ title: item.title, price: item.points }" 
        />
      </div>
    </div>

    <button class="publish-fab" @click="goPublish" title="发布资料">
      +
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DiscoverSubNav from './components/DiscoverSubNav.vue'
import CourseCard from './components/CourseCard.vue'

const router = useRouter()

const filterTabs = [
  { id: 'all', label: '全部' },
  { id: 'pdf', label: 'PDF' },
  { id: 'docx', label: '文档' },
  { id: 'zip', label: '压缩包' }
]
const activeTab = ref('all')

const hotResources = ref([
  { resourceId: 201, title: '2024年高等数学期末真题及解析', course: '高等数学', format: 'pdf', downloads: 1250, rating: 4.8, points: 15 },
  { resourceId: 202, title: '数据结构与算法完整笔记', course: '数据结构', format: 'docx', downloads: 980, rating: 4.7, points: 12 },
  { resourceId: 203, title: '深度学习入门教程（含代码）', course: '机器学习', format: 'zip', downloads: 856, rating: 4.9, points: 20 },
  { resourceId: 204, title: '操作系统原理讲义', course: '操作系统', format: 'pdf', downloads: 742, rating: 4.6, points: 10 },
  { resourceId: 205, title: '计算机网络知识点总结', course: '计算机网络', format: 'docx', downloads: 698, rating: 4.5, points: 8 },
  { resourceId: 206, title: '数据库设计案例集', course: '数据库', format: 'pdf', downloads: 645, rating: 4.7, points: 12 }
])

// const filteredHotResources = computed(() => {
//   if (activeTab.value === 'all') return hotResources.value
//   return hotResources.value.filter((item) => item.format === activeTab.value)
// })

// const trendData = ref([
//   { day: '1周前', height: 45 },
//   { day: '2周前', height: 52 },
//   { day: '3周前', height: 38 },
//   { day: '4周前', height: 61 },
//   { day: '5周前', height: 48 },
//   { day: '6周前', height: 55 },
//   { day: '本周', height: 78 }
// ])

// const weeklyNew = ref(156)
// const monthlyNew = ref(892)
// const avgQuality = ref('4.7 ⭐')

// const recommendedResources = ref([
//   { resourceId: 207, title: '2024年考研数学真题详解', uploader: '张老师', points: 18 },
//   { resourceId: 208, title: 'Python爬虫实战项目', uploader: '李同学', points: 25 },
//   { resourceId: 209, title: '前端开发完整指南', uploader: '王工程师', points: 20 },
//   { resourceId: 210, title: '算法竞赛题库', uploader: '竞赛组', points: 15 }
// ])

const displayResources = computed(() => hotResources.value.slice(0, 4))

const goDetail = (resourceId) => {
  router.push({ path: '/user/DocumentDetail', query: { resourceId } })
}

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
