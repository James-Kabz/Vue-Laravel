// src/types/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  blocked?: 'Y' | 'N';
  roles?: string[];
  role?: {
    id: number;
    name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}