// src/services/AdminService.ts
import axios from 'axios';
import type { Role, Permission, User } from '@/types/admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Response types
interface ApiResponse<T> {
  data: T;
  message?: string;
}

class AdminService {
  // Role endpoints
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await axios.get(`${API_URL}/roles`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getRole(id: number): Promise<ApiResponse<Role>> {
    const response = await axios.get(`${API_URL}/roles/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createRole(roleData: Partial<Role & { permission_ids: number[] }>): Promise<ApiResponse<Role>> {
    const response = await axios.post(`${API_URL}/roles`, roleData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateRole(id: number, roleData: Partial<Role & { permission_ids: number[] }>): Promise<ApiResponse<Role>> {
    const response = await axios.put(`${API_URL}/roles/${id}`, roleData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteRole(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${API_URL}/roles/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  // Permission endpoints
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await axios.get(`${API_URL}/permissions`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getPermission(id: number): Promise<ApiResponse<Permission>> {
    const response = await axios.get(`${API_URL}/permissions/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createPermission(permissionData: Partial<Permission>): Promise<ApiResponse<Permission>> {
    const response = await axios.post(`${API_URL}/permissions`, permissionData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updatePermission(id: number, permissionData: Partial<Permission>): Promise<ApiResponse<Permission>> {
    const response = await axios.put(`${API_URL}/permissions/${id}`, permissionData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deletePermission(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${API_URL}/permissions/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await axios.get(`${API_URL}/users`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async blockUser(id: number): Promise<ApiResponse<User>> {
    const response = await axios.put(`${API_URL}/users/${id}/block`, {}, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async unblockUser(id: number): Promise<ApiResponse<User>> {
    const response = await axios.put(`${API_URL}/users/${id}/unblock`, {}, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  // Helper method to get auth header
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
}

export default new AdminService();