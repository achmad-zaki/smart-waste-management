import { axiosInstance } from "~/lib/axios";
import type {
  AuthResponseData,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "~/types/auth.types";
import type { ApiSuccessResponse } from "~/types/api.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const response = await axiosInstance.post<ApiSuccessResponse<AuthResponseData>>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await axiosInstance.post<ApiSuccessResponse<AuthResponseData>>(
      "/auth/register",
      payload
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      authService.clearAuth();
    }
  },

  async getMe(): Promise<AuthUser> {
    const response = await axiosInstance.get<ApiSuccessResponse<AuthUser>>("/auth/me");
    authService.setCachedUser(response.data.data);
    return response.data.data;
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  getCachedUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCachedUser(user: Partial<AuthUser> | AuthUser): void {
    if (typeof window === "undefined") return;
    const current = authService.getCachedUser();
    const updated = current ? { ...current, ...user } : (user as AuthUser);
    localStorage.setItem("auth_user", JSON.stringify(updated));
  },

  setAuth(authData: AuthResponseData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", authData.token);
    authService.setCachedUser(authData.user);
  },

  clearAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};

