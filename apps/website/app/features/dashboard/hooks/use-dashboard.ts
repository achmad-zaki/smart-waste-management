import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "~/services/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  admin: () => [...dashboardKeys.all, "admin"] as const,
  user: () => [...dashboardKeys.all, "user"] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: () => dashboardService.getAdminDashboard(),
  });
}

export function useUserDashboard() {
  return useQuery({
    queryKey: dashboardKeys.user(),
    queryFn: () => dashboardService.getUserDashboard(),
  });
}

