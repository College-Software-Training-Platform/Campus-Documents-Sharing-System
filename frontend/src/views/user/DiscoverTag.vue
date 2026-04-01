<template>
  <div class="discover-tag-page">
    <!-- 二级导航（趋势 / 标签） -->
    <section class="sub-nav">
      <button class="sub-tab" @click="goTrend">趋势</button>
      <button class="sub-tab active">标签</button>

      <div class="view-switch">
        <button class="switch-btn">▦</button>
        <button class="switch-btn">☰</button>
      </div>
    </section>

    <!-- 知识图谱探索 -->
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
          @click="activeCategory = item"
        >
          {{ item }}
        </button>
      </div>

      <div class="course-grid">
        <article
          v-for="card in filteredCards"
          :key="card.code"
          class="course-card"
          @click="goSearchByCategory(card.category)"
        >
          <div class="card-top">
            <span class="icon-box">{{ card.icon }}</span>
            <span class="meta">{{ card.count }} 资源</span>
          </div>

          <h3>{{ card.code }}</h3>
          <p>{{ card.name }}</p>

          <div class="tags">
            <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 热门研究标签 -->
    <section class="hot-tag-block">
      <div class="hot-title">✨ 热门研究标签</div>
      <div class="hot-tag-list">
        <button
          v-for="tag in hotTags"
          :key="tag"
          class="hot-tag-item"
          @click="goSearchByKeyword(tag.replace('#', ''))"
        >
          <strong>{{ tag }}</strong>
          <span>活跃节点</span>
        </button>
      </div>
    </section>

    <!-- 右下角发布按钮 -->
    <button class="publish-fab" @click="goPublish" title="发布资料">
      +
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categoryList = ['所有系部', '计算机科学', '经济学', '工程学', '物理学', '数学', '生物学']
const activeCategory = ref('所有系部')

const courseCards = [
  { code: 'CS101', name: '算法与数据结构导论', category: '计算机科学', icon: '🖥️', count: 124, tags: ['Python', 'Big O', 'Sorting'] },
  { code: 'ENG202', name: '经典文学批评方法', category: '工程学', icon: '📐', count: 124, tags: ['Entropy', 'Flow'] },
  { code: 'MATH305', name: '线性代数与复变函数', category: '数学', icon: 'Σ', count: 124, tags: ['Matrices', 'Eigen'] },
  { code: 'PHYS102', name: '电磁学与波动光学', category: '物理学', icon: '🧪', count: 124, tags: ['Maxwell', 'Optics'] },
  { code: 'ECON101', name: '微观经济理论与政策', category: '经济学', icon: '💰', count: 124, tags: ['Supply', 'Market'] },
  { code: 'AI Lab', name: '机器学习与神经网络研究', category: '计算机科学', icon: '🧠', count: 124, tags: ['Deep Learning', 'NLP'] },
  { code: 'DM404', name: '交互界面设计与 UX 原则', category: '工程学', icon: '🎨', count: 124, tags: ['UI/UX', 'Design'] },
  { code: 'BIO220', name: '细胞生物学与分子遗传学', category: '生物学', icon: '🧬', count: 124, tags: ['DNA', 'Protein'] }
]

const hotTags = ['#NLP', '#Quantum', '#FinTech', '#Ecology', '#Ethics', '#Robotics']

const filteredCards = computed(() => {
  if (activeCategory.value === '所有系部') return courseCards
  return courseCards.filter((item) => item.category === activeCategory.value)
})

const goTrend = () => {
  router.push('/user/DiscoverTrend')
}

const goSearch = () => {
  router.push('/user/SearchResult')
}

const goSearchByCategory = (category) => {
  router.push({ path: '/user/SearchResult', query: { q: category } })
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
  background: #f5f7fb;
  padding: 14px 30px 30px;
  position: relative;
}

.sub-nav {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #e7ebf3;
  padding: 6px 0 10px;
  margin-bottom: 18px;
}

.sub-tab {
  border: none;
  background: transparent;
  color: #7c8aa5;
  cursor: pointer;
  padding: 8px 2px;
  font-size: 16px;
}

.sub-tab.active {
  color: #409eff;
  font-weight: 600;
}

.view-switch {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.switch-btn {
  border: none;
  background: transparent;
  color: #8d9cb8;
  cursor: pointer;
  font-size: 18px;
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
