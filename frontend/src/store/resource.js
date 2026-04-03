import { defineStore } from 'pinia'
import * as resourceApi from '@/api/resources'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    // 基础资源列表 (保留作为本地缓存)
    resources: [],
    
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
    },

    // 当前详情资源
    currentResource: null
  }),

  actions: {
    /**
     * 获取单个资源详情
     */
    async fetchResourceById(id) {
      if (!id) return
      try {
        const response = await resourceApi.getResourceDetail(id)
        this.currentResource = response.data
        return response.data
      } catch (err) {
        console.error('获取资源详情失败:', err)
        this.currentResource = null
      }
    },
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
        // 同步到基础列表
        this.resources = this.discoverTrend.data
      } catch (err) {
        console.error('获取趋势资源失败:', err)
        this.discoverTrend.data = []
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
