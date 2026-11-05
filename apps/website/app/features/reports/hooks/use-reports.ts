import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportService } from "~/services/report-service";
import type {
  ReportFilterParams,
  ReportStatus,
  UpdateReportData,
} from "~/types/report.types";
import { dashboardKeys } from "~/features/dashboard/hooks/use-dashboard";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (params?: ReportFilterParams) => [...reportKeys.lists(), params] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: number) => [...reportKeys.details(), id] as const,
};

/**
 * Hook to retrieve a filtered/paginated list of waste reports.
 */
export function useReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => reportService.getReports(params),
  });
}

/**
 * Hook to retrieve a single report by ID.
 */
export function useReportDetail(id: number) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportService.getReportById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

/**
 * Hook to classify an uploaded image via AI (FastAPI through Laravel).
 */
export function useClassifyWasteImage() {
  return useMutation({
    mutationFn: (file: File) => reportService.classifyImage(file),
  });
}

/**
 * Hook to submit a new waste report.
 */
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => reportService.createReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

/**
 * Hook to update an existing waste report's details.
 */
export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateReportData | FormData;
    }) => reportService.updateReport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

/**
 * Hook for administrators to update a report's status and record audit note.
 */
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: number;
      status: ReportStatus;
      note?: string;
    }) => reportService.updateStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

/**
 * Hook to delete a report.
 */
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

