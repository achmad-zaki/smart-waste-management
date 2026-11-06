import { axiosInstance } from "~/lib/axios";
import type { AdminDashboardData, UserDashboardData } from "~/types/dashboard.types";
import type { ApiSuccessResponse } from "~/types/api.types";

export const dashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await axiosInstance.get<ApiSuccessResponse<AdminDashboardData>>(
      "/admin/dashboard"
    );
    return response.data.data;
  },

  async getUserDashboard(): Promise<UserDashboardData> {
    const response = await axiosInstance.get<ApiSuccessResponse<UserDashboardData>>(
      "/user/dashboard"
    );
    return response.data.data;
  },
};
