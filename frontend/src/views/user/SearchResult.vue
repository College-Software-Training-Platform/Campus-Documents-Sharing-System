<template>
  <div class="search-container">
    <div class="search-header">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <h2 class="search-title">
        "{{ searchKeyword }}" 的搜索结果 
        <span class="count">共找到 {{ total }} 条资源</span>
      </h2>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <span class="label">资源分类:</span>
        <el-radio-group v-model="filter.category" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="course">课程资料</el-radio-button>
          <el-radio-button label="exam">历年真题</el-radio-button>
          <el-radio-button label="notes">学霸笔记</el-radio-button>
        </el-radio-group>
      </div>
      <div class="filter-group">
        <span class="label">排序方式:</span>
        <el-select v-model="filter.sort" size="small" style="width: 120px">
          <el-option label="综合排序" value="default" />
          <el-option label="最新发布" value="newest" />
          <el-option label="最多下载" value="hottest" />
          <el-option label="积分最低" value="cheapest" />
        </el-select>
      </div>
    </div>

    <div class="results-list">
      <el-skeleton :loading="loading" animated :count="3">
        <template #template>
          <div style="padding: 20px; display: flex; gap: 20px; background: #fff; margin-bottom: 12px; border-radius: 8px;">
            <el-skeleton-item variant="image" style="width: 50px; height: 50px" />
            <div style="flex: 1">
              <el-skeleton-item variant="h3" style="width: 40%" />
              <el-skeleton-item variant="text" style="margin-top: 15px; width: 80%" />
              <el-skeleton-item variant="text" style="margin-top: 10px; width: 50%" />
            </div>
          </div>
        </template>
        
        <template #default>
          <div v-if="results.length > 0">
            <div v-for="item in results" :key="item.id" class="resource-card">
              <div class="res-icon">
                <img :src="getFileIcon(item.type)" alt="file" />
              </div>
              <div class="res-info">
                <h3 @click="goDetail(item.id)" v-html="highlight(item.title)"></h3>
                <p class="res-desc">{{ item.description }}</p>
                <div class="res-meta">
                  <span><el-icon><User /></el-icon> {{ item.author }}</span>
                  <span><el-icon><Calendar /></el-icon> {{ item.date }}</span>
                  <span class="tag">{{ item.category }}</span>
                </div>
              </div>
              <div class="res-action">
                <div class="price" :class="{ 'free': item.points === 0 }">
                  {{ item.points > 0 ? item.points + ' 积分' : '免费' }}
                </div>
                <el-button type="primary" plain size="small" @click="goDetail(item.id)">查看详情</el-button>
              </div>
            </div>
          </div>

          <el-empty v-else description="没有找到相关资源，换个关键词试试？" />
        </template>
      </el-skeleton>
    </div>

    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="10"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Calendar } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// --- 状态变量 ---
const searchKeyword = ref(route.query.q || '')
const loading = ref(true)
const total = ref(0)
const currentPage = ref(1)
const results = ref([])

// 筛选条件
const filter = reactive({
  category: 'all',
  sort: 'default'
})

// --- 核心逻辑 ---

// 模拟 API 请求
const fetchResults = () => {
  loading.value = true
  // 实际开发请使用 axios.get('/api/search', { params: { q: searchKeyword.value, ...filter, page: currentPage.value } })
  setTimeout(() => {
    // 模拟数据生成
    results.value = [
      { id: 1, title: '计算机网络期末复习题库', description: '包含最新真题及详细解答，适合期末冲刺和考研复习。', author: '重邮学长', date: '2026-03-20', category: '历年真题', points: 5, type: 'pdf' },
      { id: 2, title: 'C++ STL 标准库思维导图', description: '一图看懂 STL 六大组件关系，助力蓝桥杯等算法竞赛。', author: '编程小能手', date: '2026-03-25', category: '学霸笔记', points: 0, type: 'img' }
    ]
    total.value = 2 // 假设总数
    loading.value = false
  }, 600)
}

// 关键词高亮 (简单实现)
const highlight = (text) => {
  if (!searchKeyword.value) return text
  const reg = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(reg, '<span class="hl">$1</span>')
}

const getFileIcon = (type) => {
  // 生产环境建议准备一套图标映射表
  return '/icons/default_file.png' 
}

const handlePageChange = (val) => {
  currentPage.value = val
  fetchResults()
}

const goDetail = (id) => {
  router.push(`/document/${id}`)
}

// --- 监听器 ---

// 1. 监听 URL 搜索词变化 (当用户在顶部搜索框再次搜索时)
watch(() => route.query.q, (newVal) => {
  searchKeyword.value = newVal || ''
  currentPage.value = 1
  fetchResults()
})

// 2. 监听筛选条件变化自动刷新
watch([() => filter.category, () => filter.sort], () => {
  currentPage.value = 1
  fetchResults()
})

onMounted(() => {
  fetchResults()
})
</script>

<style scoped>
.search-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
  min-height: 80vh;
}
.search-header { margin-bottom: 20px; }
.search-title { font-size: 20px; color: #333; margin-top: 10px; }
.search-title .count { font-size: 14px; color: #909399; font-weight: normal; margin-left: 10px; }

.filter-bar {
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.filter-group { display: flex; align-items: center; gap: 10px; }
.filter-group .label { font-size: 13px; color: #606266; }

.resource-card {
  background: #fff;
  margin-bottom: 12px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-color: #409eff33;
}

.res-icon img { width: 48px; height: 48px; object-fit: contain; }
.res-info { flex: 1; }
.res-info h3 { margin: 0 0 8px 0; color: #303133; cursor: pointer; font-size: 17px; }
.res-info h3:hover { color: #409EFF; }

/* 深度选择器处理高亮样式 */
:deep(.hl) { color: #f56c6c; font-weight: bold; }

.res-desc { font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.res-meta { font-size: 12px; color: #999; display: flex; gap: 20px; align-items: center; }
.res-meta span { display: flex; align-items: center; gap: 4px; }
.res-meta .tag { background: #f0f7ff; color: #409EFF; padding: 2px 8px; border-radius: 4px; }

.res-action { text-align: right; min-width: 120px; border-left: 1px solid #f0f0f0; padding-left: 20px; display: flex; flex-direction: column; justify-content: center; }
.price { font-size: 20px; color: #F56C6C; font-weight: bold; margin-bottom: 8px; }
.price.free { color: #67C23A; }

.pagination { margin-top: 30px; display: flex; justify-content: center; padding-bottom: 40px; }
</style>