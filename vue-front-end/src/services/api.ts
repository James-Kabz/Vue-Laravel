// src/services/api.ts
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
// Add interceptor to include token in requests
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Add interceptor to include token in requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;