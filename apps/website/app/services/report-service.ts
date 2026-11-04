import { axiosInstance } from "~/lib/axios";
import { initialReports } from "~/lib/mock-data";
import type {
  WasteReport,
  ReportStatus,
  ReportFilterParams,
  WasteClassificationResult,
} from "~/types/report.types";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationMeta,
} from "~/types/api.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface GetReportsResponse {
  reports: WasteReport[];
  meta?: PaginationMeta;
}

export const reportService = {
  async getReports(params?: ReportFilterParams): Promise<GetReportsResponse> {
    if (USE_MOCK) {
      let filtered = [...initialReports];
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((r) => r.status === params.status);
      }
      if (params?.waste_category && params.waste_category !== "all") {
        filtered = filtered.filter((r) => r.waste_category === params.waste_category);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(query) ||
            (r.address && r.address.toLowerCase().includes(query))
        );
      }
      return {
        reports: filtered,
        meta: {
          current_page: 1,
          per_page: filtered.length || 10,
          total: filtered.length,
          last_page: 1,
        },
      };
    }

    const response = await axiosInstance.get<ApiPaginatedResponse<WasteReport>>(
      "/waste-reports",
      { params }
    );

    return {
      reports: response.data.data,
      meta: response.data.meta,
    };
  },

  async getReportById(id: number): Promise<WasteReport> {
    if (USE_MOCK) {
      const found = initialReports.find((r) => r.id === id);
      if (!found) throw new Error("Laporan tidak ditemukan");
      return found;
    }

    const response = await axiosInstance.get<ApiSuccessResponse<WasteReport>>(
      `/waste-reports/${id}`
    );
    return response.data.data;
  },

  async classifyImage(file: File): Promise<WasteClassificationResult> {
    if (USE_MOCK) {
      return {
        predicted_category: "plastic",
        confidence_score: 0.945,
      };
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post<ApiSuccessResponse<WasteClassificationResult>>(
      "/waste-reports/classify",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  async createReport(formData: FormData): Promise<WasteReport> {
    if (USE_MOCK) {
      const title = String(formData.get("title") || "Laporan Baru");
      const category = (formData.get("waste_category") || "plastic") as any;
      const newReport: WasteReport = {
        id: Date.now(),
        user_id: 2,
        user_name: "Ahmad Qomaruddin",
        title,
        description: String(formData.get("description") || ""),
        image_url:
          "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
        waste_category: category,
        confidence_score: Number(formData.get("confidence_score") || 0.9),
        latitude: Number(formData.get("latitude") || -6.2),
        longitude: Number(formData.get("longitude") || 106.81),
        address: String(formData.get("address") || ""),
        status: "pending",
        created_at: new Date().toISOString(),
        status_histories: [],
      };
      initialReports.unshift(newReport);
      return newReport;
    }

    const response = await axiosInstance.post<ApiSuccessResponse<WasteReport>>(
      "/waste-reports",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  async updateStatus(
    id: number,
    status: ReportStatus,
    note?: string
  ): Promise<{ id: number; status: ReportStatus; updated_at?: string }> {
    if (USE_MOCK) {
      const report = initialReports.find((r) => r.id === id);
      if (!report) throw new Error("Laporan tidak ditemukan");
      report.status = status;
      report.status_histories = report.status_histories || [];
      report.status_histories.unshift({
        id: Date.now(),
        waste_report_id: id,
        changed_by_name: "Admin Dinas Lingkungan",
        old_status: report.status,
        new_status: status,
        note: note || "",
        created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
      });
      return { id, status, updated_at: new Date().toISOString() };
    }

    const response = await axiosInstance.patch<
      ApiSuccessResponse<{ id: number; status: ReportStatus; updated_at?: string }>
    >(`/admin/waste-reports/${id}/status`, {
      status,
      note,
    });
    return response.data.data;
  },

  async deleteReport(id: number): Promise<void> {
    if (USE_MOCK) {
      const index = initialReports.findIndex((r) => r.id === id);
      if (index !== -1) initialReports.splice(index, 1);
      return;
    }

    await axiosInstance.delete(`/waste-reports/${id}`);
  },
};
