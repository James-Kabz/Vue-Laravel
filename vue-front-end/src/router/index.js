import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginForm from '@/views/LoginForm.vue'
import RegisterForm from '@/views/RegisterForm.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import DashboardView from '@/views/DashboardView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import authStore from '../stores/auth';
import VerificationPending from '@/views/VerificationPending.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },

    {
      path: '/login',
      name: 'Login',
      component: LoginForm,
      meta: {requiresGuest: true}
    },

    {
      path: '/register',
      name: 'Register',
      component: RegisterForm,
      meta: { requiresGuest: true }
    },

    {
      path: '/verification-pending',
      name: 'VerificationPending',
      component: VerificationPending,
      meta: { requiresGuest: true }
    },

    {
      path: '/verify-email/:id/:token',
      name: 'VerifyEmail',
      component: VerifyEmail,
      props: true
    },

    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },

    {
      path: '/reset-password/:token',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true,
      meta: { requiresGuest: true }
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },

    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      // Verify token validity by checking auth state
      try {
        await authStore.checkAuth();

        // Check if route requires admin role
        if (to.matched.some(record => record.meta.requiresAdmin)) {
          const isAdmin = authStore.state.role === 'admin';
          if (!isAdmin) {
            next({ name: 'Dashboard' });
          } else {
            next();
          }
        } else {
          next();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        next({ name: 'Login' });
      }
    }
  }
  // Check if route requires guest (non-authenticated user)
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      try {
        await authStore.checkAuth();
        const isAdmin = authStore.state.role === 'admin';
        next({ name: isAdmin ? 'AdminDashboard' : 'Dashboard' });
      } catch (error) {
        console.log('Auth check failed:', error);
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router
