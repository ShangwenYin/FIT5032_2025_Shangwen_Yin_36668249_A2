import { createRouter, createWebHashHistory } from 'vue-router'
import { getCurrentUser } from '@/data'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guest: true } },
  { path: '/resources', name: 'resources', component: () => import('@/views/ResourcesView.vue') },
  { path: '/resources/:id', name: 'resource-detail', component: () => import('@/views/ResourceDetailView.vue'), props: true },
  { path: '/map', name: 'map', component: () => import('@/views/MapView.vue') },
  { path: '/assessment', name: 'assessment', component: () => import('@/views/AssessmentView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/appointments', name: 'appointments', component: () => import('@/views/AppointmentsView.vue'), meta: { requiresAuth: true } },
  { path: '/insights', name: 'insights', component: () => import('@/views/InsightsView.vue'), meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: () => import('@/views/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/email', name: 'email', component: () => import('@/views/SendEmailView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard: auth + role-based access (BR C.1, C.2)
router.beforeEach((to, from, next) => {
  const user = getCurrentUser()
  if (to.meta.requiresAuth && !user) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    next({ name: 'dashboard' })
  } else if (to.meta.guest && user) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
