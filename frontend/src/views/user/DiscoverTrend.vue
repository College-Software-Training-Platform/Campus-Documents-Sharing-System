<template>
  <div class="discover-trend">

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

      <div class="section">
        <div class="section-header">
          <h2>🔥 热门资源</h2>
          <span class="subtitle">最近7天下载最多</span>
        </div>

        <div v-if="filteredHotResources.length" class="resource-grid">
          <div v-for="(item, index) in filteredHotResources" :key="item.resourceId" class="resource-card">
            <div class="card-rank">{{ index + 1 }}</div>
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <div class="card-meta">
                <span class="course-tag">{{ item.course }}</span>
                <span class="format-tag">{{ item.format.toUpperCase() }}</span>
              </div>
              <div class="card-stats">
                <span>📥 {{ item.downloads }} 次下载</span>
                <span>⭐ {{ item.rating }}</span>
              </div>
              <div class="card-footer">
                <span class="points">{{ item.points }} 积分</span>
                <button class="btn-preview" @click="goDetail(item.resourceId)">预览</button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">当前格式暂无资源</div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>📈 近期上传趋势</h2>
          <span class="subtitle">最近30天新增资源</span>
        </div>
        <div class="trend-chart">
          <div class="bar-chart">
            <div v-for="item in trendData" :key="item.day" class="bar-item">
              <div class="bar" :style="{ height: item.height + '%' }"></div>
              <span class="label">{{ item.day }}</span>
            </div>
          </div>
          <div class="trend-stats">
            <div class="stat-item"><span>本周新增</span><strong>{{ weeklyNew }}</strong></div>
            <div class="stat-item"><span>本月新增</span><strong>{{ monthlyNew }}</strong></div>
            <div class="stat-item"><span>平均质量</span><strong>{{ avgQuality }}</strong></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>💡 为你推荐</h2>
          <span class="subtitle">基于热度和质量</span>
        </div>
        <div class="recommend-grid">
          <div v-for="item in recommendedResources" :key="item.resourceId" class="recommend-card">
            <h4>{{ item.title }}</h4>
            <p>上传者: {{ item.uploader }}</p>
            <div class="card-bottom">
              <span class="points">{{ item.points }} 积分</span>
              <button class="btn-download" @click="goDetail(item.resourceId)">查看详情</button>
            </div>
          </div>
        </div>
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

const filteredHotResources = computed(() => {
  if (activeTab.value === 'all') return hotResources.value
  return hotResources.value.filter((item) => item.format === activeTab.value)
})

const trendData = ref([
  { day: '1周前', height: 45 },
  { day: '2周前', height: 52 },
  { day: '3周前', height: 38 },
  { day: '4周前', height: 61 },
  { day: '5周前', height: 48 },
  { day: '6周前', height: 55 },
  { day: '本周', height: 78 }
])

const weeklyNew = ref(156)
const monthlyNew = ref(892)
const avgQuality = ref('4.7 ⭐')

const recommendedResources = ref([
  { resourceId: 207, title: '2024年考研数学真题详解', uploader: '张老师', points: 18 },
  { resourceId: 208, title: 'Python爬虫实战项目', uploader: '李同学', points: 25 },
  { resourceId: 209, title: '前端开发完整指南', uploader: '王工程师', points: 20 },
  { resourceId: 210, title: '算法竞赛题库', uploader: '竞赛组', points: 15 }
])

const goDetail = (resourceId) => {
  router.push({ path: '/user/DocumentDetail', query: { resourceId } })
}

const goPublish = () => {
  router.push('/user/DocumentPublish')
}
</script>

<style scoped>
.discover-trend { min-height: 100vh; background: #f5f7fa; position: relative; }
.trend-container { width: 90%; max-width: 1180px; margin: 0 auto; padding: 28px 0 44px; }
.header-section { text-align: center; margin-bottom: 22px; }
.header-section h1 { margin: 0 0 6px; color: #1e293b; }
.header-section p { margin: 0; color: #64748b; }
.filter-tabs { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px; }
.tab-btn { border: 1px solid #d9e2f2; border-radius: 999px; padding: 7px 13px; background: #fff; cursor: pointer; }
.tab-btn.active { background: #409eff; border-color: #409eff; color: #fff; }
.section { margin-bottom: 22px; }
.section-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
.section-header h2 { margin: 0; }
.subtitle { font-size: 13px; color: #8ca0bd; }
.resource-grid, .recommend-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.resource-card, .recommend-card { background: #fff; border: 1px solid #e8eef8; border-radius: 12px; padding: 12px; }
.card-rank { font-size: 24px; color: #409eff; font-weight: 700; }
.card-meta, .card-stats, .card-bottom { display: flex; justify-content: space-between; gap: 8px; }
.card-meta span, .card-stats span { font-size: 12px; color: #677995; }
.points { color: #3468f2; font-weight: 700; }
.btn-preview, .btn-download { border: none; background: #3468f2; color: #fff; border-radius: 8px; padding: 6px 10px; cursor: pointer; }
.empty-state { background: #fff; border: 1px dashed #ced7ef; border-radius: 10px; padding: 20px; text-align: center; color: #92a0b9; }
.trend-chart { display: grid; grid-template-columns: 1fr 220px; gap: 14px; background: #fff; border: 1px solid #e8eef8; border-radius: 12px; padding: 12px; }
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 170px; }
.bar-item { flex: 1; text-align: center; }
.bar { background: linear-gradient(180deg, #409eff, #66b1ff); border-radius: 6px 6px 0 0; min-height: 18px; }
.label { font-size: 12px; color: #8ca0bd; }
.trend-stats { display: grid; gap: 10px; align-content: center; }
.stat-item { display: flex; justify-content: space-between; color: #64748b; }
.stat-item strong { color: #3468f2; }
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
