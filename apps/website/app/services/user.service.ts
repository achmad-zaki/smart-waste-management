import { axiosInstance } from "~/lib/axios";
import type {
  UserAccount,
  CreateUserData,
  UpdateUserData,
  UpdateProfileData,
  UpdatePasswordData,
  UserFilterParams,
} from "~/types/user.types";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationMeta,
} from "~/types/api.types";

export interface GetUsersResponse {
  users: UserAccount[];
  meta?: PaginationMeta;
}

export const userService = {
  // --- Profile Management ---
  async getProfile(): Promise<UserAccount> {
    const response = await axiosInstance.get<ApiSuccessResponse<UserAccount>>("/profile");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserAccount> {
    const response = await axiosInstance.put<ApiSuccessResponse<UserAccount>>(
      "/profile",
      data
    );
    return response.data.data;
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await axiosInstance.put("/profile/password", data);
  },

  // --- Admin User Management ---
  async getUsers(params?: UserFilterParams): Promise<GetUsersResponse> {
    const response = await axiosInstance.get<ApiPaginatedResponse<UserAccount>>(
      "/admin/users",
      { params }
    );
    return {
      users: response.data.data,
      meta: response.data.meta,
    };
  },

  async getUserById(id: number): Promise<UserAccount> {
    const response = await axiosInstance.get<ApiSuccessResponse<UserAccount>>(
      `/admin/users/${id}`
    );
    return response.data.data;
  },

  async createUser(data: CreateUserData): Promise<UserAccount> {
    const response = await axiosInstance.post<ApiSuccessResponse<UserAccount>>(
      "/admin/users",
      data
    );
    return response.data.data;
  },

  async updateUser(id: number, data: UpdateUserData): Promise<UserAccount> {
    const response = await axiosInstance.put<ApiSuccessResponse<UserAccount>>(
      `/admin/users/${id}`,
      data
    );
    return response.data.data;
  },

  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`/admin/users/${id}`);
  },
};
