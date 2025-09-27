import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';
import { notifySessionExpired } from '@/utils/session';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue') },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/deck/:id/study',
    name: 'StudyDeck',
    component: () => import('@/pages/StudyDeck.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/deck/:id/manage',
    name: 'ManageDeck',
    component: () => import('@/pages/ManageDeck.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && (!authStore.token || authStore.isTokenExpired)) {
    authStore.logout();
    notifySessionExpired();
    return next('/login');
  }

  next();
});

export default router;
