import { axiosInstance } from "~/lib/axios";
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

export interface GetReportsResponse {
  reports: WasteReport[];
  meta?: PaginationMeta;
}

export const reportService = {
  async getReports(params?: ReportFilterParams): Promise<GetReportsResponse> {
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
    const response = await axiosInstance.get<ApiSuccessResponse<WasteReport>>(
      `/waste-reports/${id}`
    );
    return response.data.data;
  },

  async classifyImage(file: File): Promise<WasteClassificationResult> {
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
    const response = await axiosInstance.patch<
      ApiSuccessResponse<{ id: number; status: ReportStatus; updated_at?: string }>
    >(`/admin/waste-reports/${id}/status`, {
      status,
      note,
    });
    return response.data.data;
  },

  async deleteReport(id: number): Promise<void> {
    await axiosInstance.delete(`/waste-reports/${id}`);
  },
};
