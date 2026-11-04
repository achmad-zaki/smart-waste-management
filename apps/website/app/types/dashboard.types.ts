import type { WasteReport } from "./report.types";

export interface CategoryDistribution {
  organic: number;
  plastic: number;
  paper: number;
}

export interface AdminDashboardData {
  total_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  completed_reports: number;
  rejected_reports: number;
  reports_by_category: CategoryDistribution;
  recent_reports: WasteReport[];
}

export interface UserDashboardData {
  total_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  completed_reports: number;
  rejected_reports: number;
  recent_reports: WasteReport[];
}

