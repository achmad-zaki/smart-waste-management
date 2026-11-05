export type WasteCategory = "organic" | "plastic" | "paper";

export type ReportStatus = "pending" | "in_progress" | "completed" | "rejected";

export interface StatusHistoryItem {
  id: number;
  waste_report_id?: number;
  changed_by_name?: string | null;
  changed_by?: {
    id: number;
    name: string;
  } | null;
  old_status: ReportStatus | null;
  new_status: ReportStatus;
  note: string | null;
  created_at: string;
}

export interface WasteReportUser {
  id: number;
  name: string;
  email?: string;
}

export interface WasteReport {
  id: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  user?: WasteReportUser;
  title: string;
  description: string;
  image_url: string;
  waste_category: WasteCategory;
  confidence_score: number | null;
  latitude: number;
  longitude: number;
  address: string | null;
  status: ReportStatus;
  status_histories?: StatusHistoryItem[];
  created_at: string;
  updated_at?: string;
}

export interface WasteCategoryConfig {
  label: string;
  badgeClass: string;
  desc: string;
}

export interface ReportStatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export interface WasteClassificationResult {
  predicted_category: WasteCategory;
  confidence_score: number;
}

export interface UpdateReportData {
  title?: string;
  description?: string;
  waste_category?: WasteCategory;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface ReportFilterParams {
  search?: string;
  status?: string;
  waste_category?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
