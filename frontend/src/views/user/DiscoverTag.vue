<template>
  <div class="discover-tag-page">
    <DiscoverSubNav />

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2>知识图谱探索</h2>
          <p>按类别和课程代码浏览学术资源</p>
        </div>
        <button class="view-all" @click="goSearch">查看完整图谱 →</button>
      </div>

      <div class="category-chips">
        <button
          v-for="item in categoryList"
          :key="item"
          :class="['chip', { active: activeCategory === item }]"
          @click="handleCategoryClick(item)"
        >
          {{ item }}
        </button>
      </div>

      <div class="course-grid">
        <article
          v-for="card in filteredCards"
          :key="card.code"
          class="course-card"
          @click="goSearchByKeyword(card.name)"
        >
          <div class="card-top">
            <span class="icon-box">📘</span>
            <span class="meta">{{ card.count }} 资源</span>
          </div>

          <h3>{{ card.code }}</h3>
          <p>{{ card.name }}</p>

          <div class="tags">
            <span class="tag">{{ card.category }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="hot-tag-block">
      <div class="hot-title">✨ 热门研究标签</div>
      <div class="hot-tag-list">
        <button
          v-for="tag in hotTagLabels"
          :key="tag"
          class="hot-tag-item"
          @click="goSearchByKeyword(tag.replace('#', ''))"
        >
          <strong>{{ tag }}</strong>
          <span>活跃节点</span>
        </button>
      </div>
    </section>

    <button class="publish-fab" @click="goPublish" title="发布资料">
      +
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DiscoverSubNav from './components/DiscoverSubNav.vue'
import { useResourceStore } from '@/store/resource'

const router = useRouter()
const resourceStore = useResourceStore()

const activeCategory = ref('所有系部')

const collegeList = computed(() => {
  const colleges = (resourceStore.courses.data || []).map((c) => c.college).filter(Boolean)
  return Array.from(new Set(colleges))
})

const categoryList = computed(() => ['所有系部', ...collegeList.value])

const courseCards = computed(() => {
  return (resourceStore.courses.data || []).map((item) => ({
    code: `COURSE-${item.course_ID}`,
    name: item.course_Name,
    category: item.college,
    count: item.resourceCount || 0
  }))
})

const filteredCards = computed(() => {
  if (activeCategory.value === '所有系部') return courseCards.value
  return courseCards.value.filter((item) => item.category === activeCategory.value)
})

const hotTagLabels = computed(() => {
  const serverTags = resourceStore.hotTags.data || []
  if (serverTags.length) {
    return serverTags.map((t) => `#${t.tagName}`)
  }
  return ['#NLP', '#Quantum', '#FinTech', '#Ecology', '#Ethics', '#Robotics']
})

onMounted(async () => {
  await Promise.all([
    resourceStore.fetchCourses(),
    resourceStore.fetchHotTags(6)
  ])
})

const goSearch = () => {
  router.push('/user/SearchResult')
}

const handleCategoryClick = (category) => {
  activeCategory.value = category
  if (category === '所有系部') {
    goSearch()
  }
}

const goSearchByKeyword = (keyword) => {
  router.push({ path: '/user/SearchResult', query: { q: keyword } })
}

const goPublish = () => {
  router.push('/user/DocumentPublish')
}
</script>

<style scoped>
.discover-tag-page {
  min-height: calc(100vh - 60px);
  background: #f8fafc;
  padding: 10px 40px 40px;
  position: relative;
}

.section-block {
  background: #fff;
  border: 1px solid #e8edf7;
  border-radius: 14px;
  padding: 20px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.section-head h2 {
  margin: 0 0 6px;
  color: #25314a;
}

.section-head p {
  margin: 0;
  color: #8b99b3;
  font-size: 13px;
}

.view-all {
  border: none;
  background: transparent;
  color: #4d92ff;
  cursor: pointer;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.chip {
  border: 1px solid #dce4f3;
  background: #fff;
  color: #60708f;
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
}

.chip.active {
  background: #4a97ff;
  border-color: #4a97ff;
  color: #fff;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.course-card {
  border: 1px solid #e7edf7;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(32, 53, 92, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #eef4ff;
  display: grid;
  place-items: center;
}

.meta {
  color: #8e9cb6;
  font-size: 12px;
}

.course-card h3 {
  margin: 0 0 6px;
  color: #24334e;
}

.course-card p {
  margin: 0 0 12px;
  color: #7e8ca8;
  font-size: 13px;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #f1f5fc;
  color: #6f7f9d;
  border-radius: 5px;
  padding: 3px 7px;
  font-size: 11px;
}

.hot-tag-block {
  margin-top: 16px;
  background: #eaf0fb;
  border-radius: 14px;
  padding: 16px;
}

.hot-title {
  color: #283854;
  font-weight: 700;
  margin-bottom: 12px;
}

.hot-tag-list {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.hot-tag-item {
  border: none;
  background: #fff;
  border-radius: 10px;
  padding: 12px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-tag-item strong {
  color: #4e96ff;
}

.hot-tag-item span {
  color: #9ba7bf;
  font-size: 12px;
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

@media (max-width: 1200px) {
  .course-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hot-tag-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .discover-tag-page { padding: 12px; }
  .section-head { flex-direction: column; gap: 8px; }
  .course-grid { grid-template-columns: 1fr; }
  .hot-tag-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
