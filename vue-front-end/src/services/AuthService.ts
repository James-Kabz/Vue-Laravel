// src/services/AuthService.ts
import axios from 'axios';
import type { LoginCredentials, RegisterData, ResetPasswordData, AuthResponse } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AuthService {
  async register(userData: RegisterData): Promise<any> {
    return axios.post(`${API_URL}/register`, userData);
  }

  async login(credentials: LoginCredentials): Promise<{ data: AuthResponse }> {
    return axios.post(`${API_URL}/login`, credentials);
  }

  async logout(): Promise<any> {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async verifyEmail(id: string, token: string): Promise<any> {
    return axios.get(`${API_URL}/verify-email/${id}/${token}`);
  }

  async resendVerification(email: string): Promise<any> {
    return axios.post(`${API_URL}/resend-verification`, { email });
  }

  async forgotPassword(email: string): Promise<any> {
    return axios.post(`${API_URL}/forgot-password`, { email });
  }

  async resetPassword(data: ResetPasswordData): Promise<any> {
    return axios.post(`${API_URL}/reset-password`, data);
  }
}

export default new AuthService();