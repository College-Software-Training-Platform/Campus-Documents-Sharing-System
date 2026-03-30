import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../views/user/UserLayout.vue') },
  { path: '/user', component: () => import('../views/user/UserLayout.vue') },
  { path: '/login', component: () => import('../views/auth/Login.vue') },
  { path: '/success', component: () => import('../views/auth/Success.vue') },
  { path: '/failure', component: () => import('../views/auth/Failure.vue') },
  { path: '/admin', component: () => import('../views/admin/AdminLayout.vue') },
  // TODO: 后续添加其他嵌套子路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
