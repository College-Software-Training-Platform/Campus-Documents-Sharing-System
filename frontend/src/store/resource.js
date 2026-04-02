import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    resources: [
      { resourceId: 201, title: '2024年高等数学期末真题及解析', course: '高等数学', format: 'pdf', downloads: 1250, rating: 4.8, points: 15 },
      { resourceId: 202, title: '数据结构与算法完整笔记', course: '数据结构', format: 'docx', downloads: 980, rating: 4.7, points: 12 },
      { resourceId: 203, title: '深度学习入门教程（含代码）', course: '机器学习', format: 'zip', downloads: 856, rating: 4.9, points: 20 },
      { resourceId: 204, title: '操作系统原理讲义', course: '操作系统', format: 'pdf', downloads: 742, rating: 4.6, points: 10 },
      { resourceId: 205, title: '计算机网络知识点总结', course: '计算机网络', format: 'docx', downloads: 698, rating: 4.5, points: 8 },
      { resourceId: 206, title: '数据库设计案例集', course: '数据库', format: 'pdf', downloads: 645, rating: 4.7, points: 12 }
    ]
  }),
  actions: {
    addResource(newResource) {
      // 将新资源添加到列表首位
      this.resources.unshift({
        ...newResource,
        resourceId: Date.now(), // 简单模拟 ID
        downloads: 0,
        rating: 5.0
      })
    }
  }
})
