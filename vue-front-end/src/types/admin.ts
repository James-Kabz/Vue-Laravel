// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   email_verified_at: string | null;
//   blocked: 'Y' | 'N' | null;
//   created_at: string;
//   updated_at: string;
//   roles?: string[];
// }

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  email_verified_at?: string;
  blocked?: 'Y' | 'N';
  role?: Role;
  role_id?: number;
  created_at?: string;
  updated_at?: string;
}


export interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleForm {
  name: string;
}

export interface PermissionForm {
  name: string;
}

export interface UserForm {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  blocked?: 'Y' | 'N';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}