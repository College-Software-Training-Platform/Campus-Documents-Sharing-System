<template>
  <div class="search-result">

    <div class="page-wrap">
      <section class="title-row">
        <h1>组合搜索</h1>
        <p>按关键词 + 课程 + 标签 + 文件格式 + 排序，精准定位资料</p>
      </section>

      <section class="filter-panel">
        <div class="row">
          <label>关键词</label>
          <input v-model.trim="keyword" placeholder="输入标题关键词，如：高数、真题、实验" @keyup.enter="applySearch" />
        </div>

        <div class="row double">
          <div>
            <label>课程</label>
            <select v-model.number="courseId">
              <option :value="0">全部课程</option>
              <option v-for="course in courseList" :key="course.courseId" :value="course.courseId">
                {{ course.courseName }}
              </option>
            </select>
          </div>

          <div>
            <label>标签</label>
            <select v-model.number="tagId">
              <option :value="0">全部标签</option>
              <option v-for="tag in tagList" :key="tag.tagId" :value="tag.tagId">
                {{ tag.tagName }}
              </option>
            </select>
          </div>
        </div>

        <div class="row triple">
          <div>
            <label>文件格式</label>
            <select v-model="format">
              <option value="all">全部</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="zip">ZIP</option>
            </select>
          </div>

          <div>
            <label>排序方式</label>
            <select v-model="sortBy">
              <option value="uploadTime">按上传时间</option>
              <option value="requiredPoints">按积分价格</option>
            </select>
          </div>

          <div>
            <label>排序方向</label>
            <select v-model="sortOrder">
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="btn ghost" @click="resetFilters">重置筛选</button>
          <button class="btn primary" @click="applySearch">应用筛选</button>
        </div>
      </section>

      <section class="result-head">
        <h2>搜索结果</h2>
        <span>{{ finalList.length }} 条结果</span>
      </section>

      <section class="result-list">
        <article v-for="item in finalList" :key="item.resourceId" class="result-card">
          <div class="main">
            <h3>{{ item.title }}</h3>
            <p class="summary">{{ item.aiSummary }}</p>
            <div class="meta">
              <span>{{ item.courseName }}</span>
              <span>{{ item.tagName }}</span>
              <span>{{ item.format.toUpperCase() }}</span>
              <span>{{ item.uploadTime }}</span>
            </div>
          </div>
          <div class="side">
            <strong>{{ item.requiredPoints }} 积分</strong>
            <button @click="goDetail(item.resourceId)">查看详情</button>
          </div>
        </article>

        <div v-if="finalList.length === 0" class="empty-state">
          没有找到匹配资源，请尝试放宽筛选条件。
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const courseList = ref([
  { courseId: 1, courseName: '数据结构' },
  { courseId: 2, courseName: '操作系统' },
  { courseId: 3, courseName: '高等数学' },
  { courseId: 4, courseName: '计算机网络' }
])

const tagList = ref([
  { tagId: 1, tagName: '期末复习' },
  { tagId: 2, tagName: '历年真题' },
  { tagId: 3, tagName: '课程设计' },
  { tagId: 4, tagName: '实验报告' }
])

const dataList = ref([
  { resourceId: 101, title: '数据结构期末速记', aiSummary: '覆盖链表、树、图核心考点，适合考前冲刺。', courseId: 1, courseName: '数据结构', tagId: 1, tagName: '期末复习', format: 'pdf', requiredPoints: 10, uploadTime: '2026-03-29' },
  { resourceId: 102, title: '高等数学近十年真题', aiSummary: '收录多校联考真题，按题型分类并附答案。', courseId: 3, courseName: '高等数学', tagId: 2, tagName: '历年真题', format: 'zip', requiredPoints: 18, uploadTime: '2026-03-25' },
  { resourceId: 103, title: '操作系统课程设计报告模板', aiSummary: '含进程调度、内存管理实验模板和评分点。', courseId: 2, courseName: '操作系统', tagId: 3, tagName: '课程设计', format: 'docx', requiredPoints: 8, uploadTime: '2026-03-28' },
  { resourceId: 104, title: '计算机网络实验报告合集', aiSummary: '网络抓包、路由配置、HTTP实验报告范例。', courseId: 4, courseName: '计算机网络', tagId: 4, tagName: '实验报告', format: 'pdf', requiredPoints: 12, uploadTime: '2026-03-20' },
  { resourceId: 105, title: '高数期末复习讲义', aiSummary: '极限、微分、积分题型拆解，附易错点。', courseId: 3, courseName: '高等数学', tagId: 1, tagName: '期末复习', format: 'pdf', requiredPoints: 9, uploadTime: '2026-03-31' }
])

const keyword = ref(String(route.query.q || ''))
const courseId = ref(Number(route.query.courseId || 0))
const tagId = ref(Number(route.query.tagId || 0))
const format = ref(String(route.query.format || 'all'))
const sortBy = ref(String(route.query.sortBy || 'uploadTime'))
const sortOrder = ref(String(route.query.sortOrder || 'desc'))

watch(
  () => route.query,
  (query) => {
    keyword.value = String(query.q || '')
    courseId.value = Number(query.courseId || 0)
    tagId.value = Number(query.tagId || 0)
    format.value = String(query.format || 'all')
    sortBy.value = String(query.sortBy || 'uploadTime')
    sortOrder.value = String(query.sortOrder || 'desc')
  }
)

const filteredList = computed(() => {
  return dataList.value.filter((item) => {
    const normalizedKeyword = keyword.value.trim().toLowerCase()
    const keywordMatch = normalizedKeyword
      ? item.title.toLowerCase().includes(normalizedKeyword) || item.aiSummary.toLowerCase().includes(normalizedKeyword)
      : true

    const courseMatch = courseId.value ? item.courseId === courseId.value : true
    const tagMatch = tagId.value ? item.tagId === tagId.value : true
    const formatMatch = format.value === 'all' ? true : item.format === format.value

    return keywordMatch && courseMatch && tagMatch && formatMatch
  })
})

const finalList = computed(() => {
  const list = [...filteredList.value]
  list.sort((a, b) => {
    const va = sortBy.value === 'uploadTime' ? new Date(a.uploadTime).getTime() : a.requiredPoints
    const vb = sortBy.value === 'uploadTime' ? new Date(b.uploadTime).getTime() : b.requiredPoints

    return sortOrder.value === 'desc' ? vb - va : va - vb
  })

  return list
})

const applySearch = () => {
  router.push({
    path: '/user/SearchResult',
    query: {
      q: keyword.value || '',
      courseId: courseId.value || '',
      tagId: tagId.value || '',
      format: format.value === 'all' ? '' : format.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
  })
}

const resetFilters = () => {
  keyword.value = ''
  courseId.value = 0
  tagId.value = 0
  format.value = 'all'
  sortBy.value = 'uploadTime'
  sortOrder.value = 'desc'

  router.push({ path: '/user/SearchResult', query: {} })
}

const goDetail = (resourceId) => {
  router.push({ path: '/user/DocumentDetail', query: { resourceId } })
}
</script>

<style scoped>
.search-result { min-height: 100vh; background: #f6f8fc; }
.page-wrap { width: 90%; max-width: 1180px; margin: 0 auto; padding: 28px 0 44px; }
.title-row { margin-bottom: 16px; }
.title-row h1 { margin: 0 0 8px; color: #1f2a44; }
.title-row p { margin: 0; color: #6c7a96; }

.filter-panel { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 4px 14px rgba(15, 33, 67, 0.06); margin-bottom: 14px; }
.row { margin-bottom: 12px; }
.row label { display: block; font-size: 13px; color: #7683a0; margin-bottom: 6px; }
.row input,
.row select { width: 100%; border: 1px solid #d7def0; border-radius: 8px; padding: 9px 10px; outline: none; }
.row input:focus,
.row select:focus { border-color: #3468f2; box-shadow: 0 0 0 2px rgba(52, 104, 242, 0.12); }

.row.double,
.row.triple { display: grid; gap: 10px; }
.row.double { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.row.triple { grid-template-columns: repeat(3, minmax(0, 1fr)); }

.actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn { border: none; border-radius: 8px; padding: 8px 14px; cursor: pointer; }
.btn.ghost { background: #eef3ff; color: #3a4f80; }
.btn.primary { background: #3468f2; color: #fff; }

.result-head { display: flex; justify-content: space-between; align-items: center; margin: 14px 0; }
.result-head h2 { margin: 0; color: #1f2a44; }
.result-head span { color: #8a97b2; }

.result-list { display: grid; gap: 10px; }
.result-card { display: flex; justify-content: space-between; gap: 12px; background: #fff; border: 1px solid #e9eefb; border-radius: 10px; padding: 12px; }
.main h3 { margin: 0 0 6px; color: #1f2a44; }
.summary { margin: 0 0 8px; color: #5f6e8b; font-size: 14px; }
.meta { display: flex; gap: 8px; flex-wrap: wrap; }
.meta span { background: #f2f6ff; color: #5a6c92; border-radius: 999px; padding: 3px 8px; font-size: 12px; }

.side { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-width: 120px; }
.side strong { color: #3468f2; }
.side button { border: none; background: #3468f2; color: #fff; border-radius: 8px; padding: 6px 10px; cursor: pointer; }

.empty-state { text-align: center; color: #92a0b9; background: #fff; border-radius: 10px; padding: 28px; border: 1px dashed #ced7ef; }

@media (max-width: 900px) {
  .row.double,
  .row.triple { grid-template-columns: 1fr; }
  .result-card { flex-direction: column; }
  .side { align-items: flex-start; gap: 8px; }
}
</style>
