// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import authStore from '@/stores/auth';

// Define route meta types
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    requiresAdmin?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/verification-pending',
    name: 'VerificationPending',
    component: () => import('@/views/auth/VerificationPendingView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/verify-email/:id/:token',
    name: 'VerifyEmail',
    component: () => import('@/views/auth/VerifyEmailView.vue'),
    props: true
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    props: true,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Admin routes
  {
    path: '/admin/roles',
    name: 'RoleList',
    component: () => import('@/views/admin/RoleListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/permissions',
    name: 'PermissionList',
    component: () => import('@/views/admin/PermissionListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'UserList',
    component: () => import('@/views/admin/UserListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
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
        // If token validation fails, allow access to guest routes
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
