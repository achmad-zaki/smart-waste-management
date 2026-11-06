export type UserRole = "admin" | "user";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  reports_count?: number;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponseData {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

