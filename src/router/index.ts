import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
  {
    path: '/deck/:id/study',
    name: 'StudyDeck',
    component: () => import('@/pages/StudyDeck.vue'),
    props: true,
  },
  {
    path: '/deck/:id/manage',
    name: 'ManageDeck',
    component: () => import('@/pages/ManageDeck.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
