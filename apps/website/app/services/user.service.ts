import { axiosInstance } from "~/lib/axios";
import { initialUsers } from "~/lib/mock-data";
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

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface GetUsersResponse {
  users: UserAccount[];
  meta?: PaginationMeta;
}

export const userService = {
  // --- Profile Management ---
  async getProfile(): Promise<UserAccount> {
    if (USE_MOCK) {
      return initialUsers[0];
    }
    const response = await axiosInstance.get<ApiSuccessResponse<UserAccount>>("/profile");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserAccount> {
    if (USE_MOCK) {
      const user = initialUsers[0];
      user.name = data.name;
      user.phone = data.phone || user.phone;
      return user;
    }
    const response = await axiosInstance.put<ApiSuccessResponse<UserAccount>>(
      "/profile",
      data
    );
    return response.data.data;
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    await axiosInstance.put("/profile/password", data);
  },

  // --- Admin User Management ---
  async getUsers(params?: UserFilterParams): Promise<GetUsersResponse> {
    if (USE_MOCK) {
      let filtered = [...initialUsers];
      if (params?.role && params.role !== "all") {
        filtered = filtered.filter((u) => u.role === params.role);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
      }
      return {
        users: filtered,
        meta: {
          current_page: 1,
          per_page: filtered.length || 10,
          total: filtered.length,
          last_page: 1,
        },
      };
    }

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
    if (USE_MOCK) {
      const user = initialUsers.find((u) => u.id === id);
      if (!user) throw new Error("Pengguna tidak ditemukan");
      return user;
    }
    const response = await axiosInstance.get<ApiSuccessResponse<UserAccount>>(
      `/admin/users/${id}`
    );
    return response.data.data;
  },

  async createUser(data: CreateUserData): Promise<UserAccount> {
    if (USE_MOCK) {
      const newUser: UserAccount = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || "0812-0000-0000",
        reports_count: 0,
        created_at: new Date().toISOString().substring(0, 10),
      };
      initialUsers.unshift(newUser);
      return newUser;
    }

    const response = await axiosInstance.post<ApiSuccessResponse<UserAccount>>(
      "/admin/users",
      data
    );
    return response.data.data;
  },

  async updateUser(id: number, data: UpdateUserData): Promise<UserAccount> {
    if (USE_MOCK) {
      const user = initialUsers.find((u) => u.id === id);
      if (!user) throw new Error("Pengguna tidak ditemukan");
      if (data.name) user.name = data.name;
      if (data.phone) user.phone = data.phone;
      if (data.role) user.role = data.role;
      return user;
    }

    const response = await axiosInstance.put<ApiSuccessResponse<UserAccount>>(
      `/admin/users/${id}`,
      data
    );
    return response.data.data;
  },

  async deleteUser(id: number): Promise<void> {
    if (USE_MOCK) {
      const index = initialUsers.findIndex((u) => u.id === id);
      if (index !== -1) initialUsers.splice(index, 1);
      return;
    }

    await axiosInstance.delete(`/admin/users/${id}`);
  },
};

