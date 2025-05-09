import axios from 'axios'

const API_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000/api'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add interceptor to include token in requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default {
  // Register a new user
  register(userData) {
    return apiClient.post('/register', userData)
  },

  // Login user
  login(credentials) {
    return apiClient.post('/login', credentials)
  },

  // Logout user
  logout() {
    return apiClient.post('/logout')
  },

  // Verify email
  verifyEmail(id, token) {
    return apiClient.get(`/verify-email/${id}/${token}`)
  },

  // Resend verification email
  resendVerification(email) {
    return apiClient.post('/email/resend', { email })
  },

  // Request password reset
  forgotPassword(email) {
    return apiClient.post('/forgot-password', { email })
  },

  // Reset password
  resetPassword(data) {
    return apiClient.post('/reset-password', data)
  },

  // Get current user (for checking auth status)
  getCurrentUser() {
    return apiClient.get('/user')
  },
}
