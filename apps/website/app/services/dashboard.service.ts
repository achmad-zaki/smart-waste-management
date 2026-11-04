import { axiosInstance } from "~/lib/axios";
import { initialReports } from "~/lib/mock-data";
import type { AdminDashboardData, UserDashboardData } from "~/types/dashboard.types";
import type { ApiSuccessResponse } from "~/types/api.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const dashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    if (USE_MOCK) {
      return {
        total_reports: initialReports.length,
        pending_reports: initialReports.filter((r) => r.status === "pending").length,
        in_progress_reports: initialReports.filter((r) => r.status === "in_progress").length,
        completed_reports: initialReports.filter((r) => r.status === "completed").length,
        rejected_reports: initialReports.filter((r) => r.status === "rejected").length,
        reports_by_category: {
          organic: initialReports.filter((r) => r.waste_category === "organic").length,
          plastic: initialReports.filter((r) => r.waste_category === "plastic").length,
          paper: initialReports.filter((r) => r.waste_category === "paper").length,
        },
        recent_reports: initialReports.slice(0, 5),
      };
    }

    const response = await axiosInstance.get<ApiSuccessResponse<AdminDashboardData>>(
      "/admin/dashboard"
    );
    return response.data.data;
  },

  async getUserDashboard(): Promise<UserDashboardData> {
    if (USE_MOCK) {
      const myReports = initialReports.filter((r) => r.user_id === 2);
      return {
        total_reports: myReports.length,
        pending_reports: myReports.filter((r) => r.status === "pending").length,
        in_progress_reports: myReports.filter((r) => r.status === "in_progress").length,
        completed_reports: myReports.filter((r) => r.status === "completed").length,
        rejected_reports: myReports.filter((r) => r.status === "rejected").length,
        recent_reports: myReports.slice(0, 5),
      };
    }

    const response = await axiosInstance.get<ApiSuccessResponse<UserDashboardData>>(
      "/user/dashboard"
    );
    return response.data.data;
  },
};

