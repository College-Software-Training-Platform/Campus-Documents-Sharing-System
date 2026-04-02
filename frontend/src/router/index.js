import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

const userRouteRedirects = [
  { path: '/user/discover-tag', redirect: '/user/DiscoverTag' },
  { path: '/user/discover-trend', redirect: '/user/DiscoverTrend' },
  { path: '/user/search-result', redirect: '/user/SearchResult' },
  { path: '/user/document-publish', redirect: '/user/DocumentPublish' },
  { path: '/user/document-detail', redirect: '/user/DocumentDetail' },
  { path: '/user/profile', redirect: '/user/Profile' }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...userRouteRedirects],
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 1. 定义完全公开的白名单 (所有人可访问)
  const publicWhiteList = ['/', '/index', '/auth/login', '/auth/register', '/auth/Login', '/auth/Register']
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 2. 如果路径在公开白名单中，或者是注册/登录流程页面，直接放行
  if (publicWhiteList.includes(to.path) || to.path.startsWith('/auth/')) {
    next()
  } else {
    // 3. 非白名单页面，检查是否有 token
    if (!token) {
      next('/auth/login')
    } else {
      // 4. 有 token，进一步校验权限
      // 如果尝试进入管理端页面 (/admin/*)，校验角色
      if (to.path.startsWith('/admin')) {
        if (user.role === 'admin') {
          next()
        } else {
          // 角色不符，跳转回首页或报错 (此处跳转回首页)
          next('/')
        }
      } else {
        // 其他页面 (如 /user/*)，已登录即可放行
        next()
      }
    }
  }
})

export default router;
