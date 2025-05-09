import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authStore from '../stores/auth'
import RolesManagement from '@/views/admin/RolesManagement.vue'
import UsersManagement from '@/views/admin/UsersManagement.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import DashboardView from '@/views/DashboardView.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerificationPending from '@/views/auth/VerificationPending.vue'
import RegisterForm from '@/views/auth/RegisterForm.vue'
import LoginForm from '@/views/auth/LoginForm.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/login',
      name: 'Login',
      component: LoginForm,
      meta: { requiresGuest: true },
    },

    {
      path: '/register',
      name: 'Register',
      component: RegisterForm,
      meta: { requiresGuest: true },
    },

    {
      path: '/verification-pending',
      name: 'VerificationPending',
      component: VerificationPending,
      meta: { requiresGuest: true },
    },

    {
      path: '/verify-email/:id/:token',
      name: 'VerifyEmail',
      component: VerificationPending,
      props: true,
    },

    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { requiresGuest: true },
    },

    {
      path: '/reset-password/:token',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true,
      meta: { requiresGuest: true },
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },

    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    {
      path: '/admin/roles',
      name: 'RolesManagement',
      component: RolesManagement,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    {
      path: '/admin/users',
      name: 'UsersManagement',
      component: UsersManagement,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      // Verify token validity by checking auth state
      try {
        await authStore.checkAuth()

        // Check if route requires admin role
        if (to.matched.some((record) => record.meta.requiresAdmin)) {
          const isAdmin = authStore.state.role === 'admin'
          if (!isAdmin) {
            next({ name: 'Dashboard' })
          } else {
            next()
          }
        } else {
          next()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        next({ name: 'Login' })
      }
    }
  }
  // Check if route requires guest (non-authenticated user)
  else if (to.matched.some((record) => record.meta.requiresGuest)) {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    if (isAuthenticated) {
      try {
        await authStore.checkAuth()
        const isAdmin = authStore.state.role === 'admin'
        next({ name: isAdmin ? 'AdminDashboard' : 'Dashboard' })
      } catch (error) {
        console.log('Auth check failed:', error)
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
