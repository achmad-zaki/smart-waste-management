export type Role = "admin" | "user";

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  reports_count?: number;
  created_at?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: Role;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: Role;
  phone?: string;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UserFilterParams {
  search?: string;
  role?: string;
  page?: number;
  per_page?: number;
}
