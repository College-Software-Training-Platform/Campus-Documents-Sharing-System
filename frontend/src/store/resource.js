import { defineStore } from 'pinia'
import * as resourceApi from '@/api/resources'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    // 静态 mock 数据（保留用于离线测试）
    resources: [
      { resourceId: 201, title: '2024年高等数学期末真题及解析', course: '高等数学', format: 'pdf', downloads: 1250, rating: 4.8, points: 15 },
      { resourceId: 202, title: '数据结构与算法完整笔记', course: '数据结构', format: 'docx', downloads: 980, rating: 4.7, points: 12 },
      { resourceId: 203, title: '深度学习入门教程（含代码）', course: '机器学习', format: 'zip', downloads: 856, rating: 4.9, points: 20 },
      { resourceId: 204, title: '操作系统原理讲义', course: '操作系统', format: 'pdf', downloads: 742, rating: 4.6, points: 10 },
      { resourceId: 205, title: '计算机网络知识点总结', course: '计算机网络', format: 'docx', downloads: 698, rating: 4.5, points: 8 },
      { resourceId: 206, title: '数据库设计案例集', course: '数据库', format: 'pdf', downloads: 645, rating: 4.7, points: 12 }
    ],
    
    // 发现趋势数据
    discoverTrend: {
      data: [],
      loading: false,
      pagination: { total: 0, page: 1, limit: 10, pages: 0 }
    },
    
    // 课程列表
    courses: {
      data: [],
      loading: false
    },
    
    // 热门标签
    hotTags: {
      data: [],
      loading: false
    },
    
    // 搜索结果
    searchResults: {
      data: [],
      loading: false,
      pagination: { total: 0, page: 1, limit: 10, pages: 0 }
    }
  }),

  actions: {
    /**
     * 添加资源（发布时使用）
     */
    addResource(newResource) {
      this.resources.unshift({
        ...newResource,
        resourceId: Date.now(),
        downloads: 0,
        rating: 5.0
      })
    },

    /**
     * 获取发现趋势资源
     */
    async fetchDiscoverTrend(params = {}) {
      this.discoverTrend.loading = true
      try {
        const response = await resourceApi.getDiscoverTrend({
          format: params.format || 'all',
          sort: params.sort || 'hottest',
          page: params.page || 1,
          limit: params.limit || 10
        })
        
        this.discoverTrend.data = response.data || []
        this.discoverTrend.pagination = response.pagination || {}
      } catch (err) {
        console.error('获取趋势资源失败:', err)
        // 降级到 mock 数据
        this.discoverTrend.data = this.resources
      } finally {
        this.discoverTrend.loading = false
      }
    },

    /**
     * 获取所有课程
     */
    async fetchCourses() {
      this.courses.loading = true
      try {
        const response = await resourceApi.getCourses()
        this.courses.data = response.data || []
      } catch (err) {
        console.error('获取课程列表失败:', err)
        this.courses.data = []
      } finally {
        this.courses.loading = false
      }
    },

    /**
     * 获取热门标签
     */
    async fetchHotTags(limit = 6) {
      this.hotTags.loading = true
      try {
        const response = await resourceApi.getHotTags(limit)
        this.hotTags.data = response.data || []
      } catch (err) {
        console.error('获取热门标签失败:', err)
        this.hotTags.data = []
      } finally {
        this.hotTags.loading = false
      }
    },

    /**
     * 搜索资源
     */
    async fetchSearchResults(params = {}) {
      this.searchResults.loading = true
      try {
        const response = await resourceApi.searchResources({
          q: params.q || '',
          category: params.category || 'all',
          sort: params.sort || 'default',
          page: params.page || 1,
          limit: params.limit || 10
        })
        
        this.searchResults.data = response.data || []
        this.searchResults.pagination = response.pagination || {}
      } catch (err) {
        console.error('搜索资源失败:', err)
        this.searchResults.data = []
      } finally {
        this.searchResults.loading = false
      }
    }
  }
})
