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

export default router;
