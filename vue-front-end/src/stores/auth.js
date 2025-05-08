import { reactive, readonly } from 'vue';
import AuthService from '../services/AuthService';
import router from '../router';

const state = reactive({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('role') || null
});

const methods = {
  async register(userData) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.register(userData);
      state.loading = false;
      return response.data;
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || 'Registration failed';
      throw error;
    }
  },

  async login(credentials) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.login(credentials);

      // Handle the specific response structure from your Laravel API
      if (response.data && response.data.success) {
        const { token } = response.data.data;
        const user = response.data.data.user;
        const roles = user.roles || [];
        const role = roles.length > 0 ? roles[0] : 'user'; // Default to 'user' if no roles

        localStorage.setItem('token', token);
        if (credentials.remember) {
          localStorage.setItem('remember', 'true');
        }

        state.token = token;
        state.user = user;
        state.role = role;
        state.isAuthenticated = true;
        localStorage.setItem('role', role);

        state.loading = false;
        return {
          token,
          user,
          role
        };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || error.message || 'Login failed';
      throw error;
    }
  },

  async logout() {
    state.loading = true;
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('remember');

      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;

      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      state.loading = false;
    }
  },

  async verifyEmail(id, token) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.verifyEmail(id, token);
      state.loading = false;
      return response.data;
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || 'Email verification failed';
      throw error;
    }
  },

  async resendVerification(email) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.resendVerification(email);
      state.loading = false;
      return response.data;
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || 'Failed to resend verification email';
      throw error;
    }
  },

  async forgotPassword(email) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.forgotPassword(email);
      state.loading = false;
      return response.data;
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || 'Failed to send password reset link';
      throw error;
    }
  },

  async resetPassword(data) {
    state.loading = true;
    state.error = null;
    try {
      const response = await AuthService.resetPassword(data);
      state.loading = false;
      return response.data;
    } catch (error) {
      state.loading = false;
      state.error = error.response?.data?.message || 'Password reset failed';
      throw error;
    }
  },

  async checkAuth() {
    if (!state.token) return false;

    try {
      const response = await AuthService.getCurrentUser();
      state.user = response.data;
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // If token is invalid, clear auth state
      if (error.response?.status === 401) {
        this.logout();
      }
      return false;
    }
  },

  clearError() {
    state.error = null;
  }
};

export default {
  state: readonly(state),
  ...methods
};