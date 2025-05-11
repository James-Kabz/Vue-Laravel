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
  // ==============================================
  // Users API
  // ==============================================

  /**
   * Get all users with pagination
   * @param {Object} params - Query parameters (page, per_page, search, etc.)
   * @returns {Promise}
   */
  getUsers(params = {}) {
    return apiClient.get('/users', { params })
  },

  /**
   * Get a single user by ID
   * @param {Number|String} id - User ID
   * @returns {Promise}
   */
  getUser(id) {
    return apiClient.get(`/users/${id}`)
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  createUser(userData) {
    return apiClient.post('/users', userData)
  },

  /**
   * Update a user
   * @param {Number|String} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise}
   */
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
  },

  /**
   * Delete a user
   * @param {Number|String} id - User ID
   * @returns {Promise}
   */
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  },

  // ==============================================
  // Roles API
  // ==============================================

  /**
   * Get all roles with pagination
   * @param {Object} params - Query parameters (page, per_page, search, etc.)
   * @returns {Promise}
   */
  getRoles(params = {}) {
    return apiClient.get('/roles', { params })
  },

  /**
   * Get a single role by ID
   * @param {Number|String} id - Role ID
   * @returns {Promise}
   */
  getRole(id) {
    return apiClient.get(`/roles/${id}`)
  },

  /**
   * Create a new role
   * @param {Object} roleData - Role data
   * @returns {Promise}
   */
  createRole(roleData) {
    return apiClient.post('/roles', roleData)
  },

  /**
   * Update a role
   * @param {Number|String} id - Role ID
   * @param {Object} roleData - Updated role data
   * @returns {Promise}
   */
  updateRole(id, roleData) {
    return apiClient.put(`/roles/${id}`, roleData)
  },

  /**
   * Delete a role
   * @param {Number|String} id - Role ID
   * @returns {Promise}
   */
  deleteRole(id) {
    return apiClient.delete(`/roles/${id}`)
  },

  /**
   * Get permissions for a specific role
   * @param {Number|String} roleId - Role ID
   * @returns {Promise}
   */
  getRolePermissions(roleId) {
    return apiClient.get(`/roles/${roleId}/permissions`)
  },

  /**
   * Sync permissions to a role
   * @param {Number|String} roleId - Role ID
   * @param {Array} permissionIds - Array of permission IDs
   * @returns {Promise}
   */
  syncPermissionsToRole(roleId, permissionIds) {
    return apiClient.post(`/roles/${roleId}/give-permissions`, { permissions: permissionIds })
  },

  // ==============================================
  // Permissions API
  // ==============================================

  /**
   * Get all permissions
   * @param {Object} params - Query parameters (page, per_page, search, etc.)
   * @returns {Promise}
   */
  getPermissions(params = {}) {
    return apiClient.get('/permissions', { params })
  },

  /**
   * Get a single permission by ID
   * @param {Number|String} id - Permission ID
   * @returns {Promise}
   */
  getPermission(id) {
    return apiClient.get(`/permissions/${id}`)
  },

  /**
   * Create a new permission
   * @param {Object} permissionData - Permission data
   * @returns {Promise}
   */
  createPermission(permissionData) {
    return apiClient.post('/permissions', permissionData)
  },

  /**
   * Update a permission
   * @param {Number|String} id - Permission ID
   * @param {Object} permissionData - Updated permission data
   * @returns {Promise}
   */
  updatePermission(id, permissionData) {
    return apiClient.put(`/permissions/${id}`, permissionData)
  },

  /**
   * Delete a permission
   * @param {Number|String} id - Permission ID
   * @returns {Promise}
   */
  deletePermission(id) {
    return apiClient.delete(`/permissions/${id}`)
  },
}
