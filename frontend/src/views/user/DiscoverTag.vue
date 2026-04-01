<template>
  <div class="discover-tag">
    <UserHeader />

    <div class="page-wrap">
      <section class="hero">
        <h1>课程分类导航</h1>
        <p>按学院、课程、标签快速定位你要的资料</p>
      </section>

      <section class="block">
        <div class="block-title">
          <h2>🏫 学院筛选</h2>
          <button class="text-btn" @click="resetFilters">重置筛选</button>
        </div>
        <div class="college-tabs">
          <button
            v-for="college in collegeList"
            :key="college"
            :class="['chip', { active: selectedCollege === college }]"
            @click="selectedCollege = college"
          >
            {{ college }}
          </button>
        </div>
      </section>

      <section class="block">
        <div class="block-title">
          <h2>📚 课程列表</h2>
          <span>{{ filteredCourses.length }} 门课程</span>
        </div>

        <div class="course-grid">
          <button
            v-for="course in filteredCourses"
            :key="course.courseId"
            :class="['course-card', { active: selectedCourseId === course.courseId }]"
            @click="selectedCourseId = course.courseId"
          >
            <h3>{{ course.courseName }}</h3>
            <p>{{ course.college }}</p>
          </button>
        </div>
      </section>

      <section class="block">
        <div class="block-title">
          <h2>🏷️ 热门标签</h2>
          <span>可多维浏览资源类型</span>
        </div>

        <div class="tag-list">
          <button
            v-for="tag in tagList"
            :key="tag.tagId"
            :class="['tag-pill', { active: selectedTagId === tag.tagId }]"
            @click="selectedTagId = tag.tagId"
          >
            {{ tag.tagName }}
          </button>
          <button class="tag-pill clear" @click="selectedTagId = null">清空标签</button>
        </div>
      </section>

      <section class="block">
        <div class="block-title">
          <h2>✨ 当前分类下推荐资源</h2>
          <button class="jump-btn" @click="goSearch">去组合搜索</button>
        </div>

        <div class="resource-list" v-if="filteredResources.length">
          <div v-for="item in filteredResources" :key="item.resourceId" class="resource-item">
            <div>
              <h4>{{ item.title }}</h4>
              <p>
                {{ item.courseName }} · {{ item.format.toUpperCase() }} · {{ item.uploadTime }}
              </p>
            </div>
            <div class="right">
              <span>{{ item.requiredPoints }} 积分</span>
              <button @click="goDetail(item.resourceId)">查看详情</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">当前筛选条件下暂无资源，请切换学院/课程/标签试试</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from '@/components/layout/UserHeader.vue'

const router = useRouter()

const collegeList = ['全部学院', '计算机学院', '数学学院', '自动化学院', '外国语学院']
const selectedCollege = ref('全部学院')
const selectedCourseId = ref(null)
const selectedTagId = ref(null)

const courseList = ref([
  { courseId: 1, courseName: '数据结构', college: '计算机学院' },
  { courseId: 2, courseName: '操作系统', college: '计算机学院' },
  { courseId: 3, courseName: '高等数学', college: '数学学院' },
  { courseId: 4, courseName: '线性代数', college: '数学学院' },
  { courseId: 5, courseName: '自动控制原理', college: '自动化学院' },
  { courseId: 6, courseName: '学术英语', college: '外国语学院' }
])

const tagList = ref([
  { tagId: 1, tagName: '期末复习' },
  { tagId: 2, tagName: '历年真题' },
  { tagId: 3, tagName: '课程设计' },
  { tagId: 4, tagName: '实验报告' },
  { tagId: 5, tagName: '保研经验' }
])

const resourceList = ref([
  { resourceId: 11, title: '数据结构期末重点总结', courseId: 1, courseName: '数据结构', format: 'pdf', requiredPoints: 10, uploadTime: '2026-03-25', tagId: 1 },
  { resourceId: 12, title: '高等数学近五年真题', courseId: 3, courseName: '高等数学', format: 'zip', requiredPoints: 16, uploadTime: '2026-03-22', tagId: 2 },
  { resourceId: 13, title: '操作系统课程设计模板', courseId: 2, courseName: '操作系统', format: 'docx', requiredPoints: 8, uploadTime: '2026-03-20', tagId: 3 },
  { resourceId: 14, title: '自动控制实验报告范例', courseId: 5, courseName: '自动控制原理', format: 'pdf', requiredPoints: 12, uploadTime: '2026-03-18', tagId: 4 },
  { resourceId: 15, title: '计算机学院保研经验汇总', courseId: 1, courseName: '数据结构', format: 'pdf', requiredPoints: 20, uploadTime: '2026-03-15', tagId: 5 }
])

const filteredCourses = computed(() => {
  if (selectedCollege.value === '全部学院') {
    return courseList.value
  }
  return courseList.value.filter((item) => item.college === selectedCollege.value)
})

watch(filteredCourses, (nextCourses) => {
  if (!selectedCourseId.value) return
  const exists = nextCourses.some((item) => item.courseId === selectedCourseId.value)
  if (!exists) selectedCourseId.value = null
})

const filteredResources = computed(() => {
  return resourceList.value.filter((item) => {
    const courseMatch = selectedCourseId.value ? item.courseId === selectedCourseId.value : true
    const tagMatch = selectedTagId.value ? item.tagId === selectedTagId.value : true

    if (selectedCollege.value === '全部学院') {
      return courseMatch && tagMatch
    }

    const currentCourse = courseList.value.find((course) => course.courseId === item.courseId)
    const collegeMatch = currentCourse?.college === selectedCollege.value
    return courseMatch && tagMatch && collegeMatch
  })
})

const goDetail = (resourceId) => {
  router.push({ path: '/user/DocumentDetail', query: { resourceId } })
}

const goSearch = () => {
  router.push({
    path: '/user/SearchResult',
    query: {
      courseId: selectedCourseId.value || '',
      tagId: selectedTagId.value || ''
    }
  })
}

const resetFilters = () => {
  selectedCollege.value = '全部学院'
  selectedCourseId.value = null
  selectedTagId.value = null
}
</script>

<style scoped>
.discover-tag { min-height: 100vh; background: #f6f8fc; }
.page-wrap { width: 90%; max-width: 1180px; margin: 0 auto; padding: 28px 0 44px; }
.hero { margin-bottom: 20px; }
.hero h1 { margin: 0 0 8px; color: #1f2a44; }
.hero p { margin: 0; color: #6c7a96; }

.block { background: #fff; border-radius: 14px; padding: 18px; margin-bottom: 18px; box-shadow: 0 4px 14px rgba(15, 33, 67, 0.06); }
.block-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.block-title h2 { margin: 0; font-size: 18px; color: #1f2a44; }
.block-title span { color: #8593ad; font-size: 13px; }
.text-btn { border: none; background: transparent; color: #3468f2; cursor: pointer; font-size: 13px; }

.college-tabs, .tag-list { display: flex; gap: 10px; flex-wrap: wrap; }
.chip, .tag-pill { border: 1px solid #d7def0; background: #f9fbff; color: #3f5177; border-radius: 999px; padding: 7px 13px; cursor: pointer; }
.chip.active, .tag-pill.active { background: #3468f2; color: #fff; border-color: #3468f2; }
.tag-pill.clear { background: #fff; border-style: dashed; }

.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
.course-card { text-align: left; border: 1px solid #e3e8f5; border-radius: 10px; padding: 14px; background: #fff; cursor: pointer; }
.course-card h3 { margin: 0 0 6px; font-size: 16px; color: #203057; }
.course-card p { margin: 0; font-size: 12px; color: #8a97b2; }
.course-card.active { border-color: #3468f2; box-shadow: 0 0 0 2px rgba(52, 104, 242, 0.12); }

.resource-list { display: grid; gap: 10px; }
.resource-item { display: flex; justify-content: space-between; align-items: center; border: 1px solid #e9eefb; border-radius: 10px; padding: 12px; }
.resource-item h4 { margin: 0 0 4px; color: #1f2a44; }
.resource-item p { margin: 0; color: #8997b2; font-size: 12px; }
.right { display: flex; align-items: center; gap: 10px; }
.right span { color: #3468f2; font-weight: 700; }
.right button, .jump-btn { border: none; background: #3468f2; color: #fff; border-radius: 8px; padding: 7px 12px; cursor: pointer; }
.jump-btn { font-size: 13px; }
.empty-state { text-align: center; color: #92a0b9; background: #fff; border-radius: 10px; padding: 18px; border: 1px dashed #ced7ef; }

@media (max-width: 768px) {
  .page-wrap { width: 95%; }
  .resource-item { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>
