import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "~/services/user.service";
import { authService } from "~/services/auth.service";
import { authKeys } from "~/features/auth/hooks/use-auth";
import type { AuthUser } from "~/types/auth.types";
import type {
  CreateUserData,
  UpdateUserData,
  UserFilterParams,
} from "~/types/user.types";

export const adminUserKeys = {
  all: ["admin-users"] as const,
  lists: () => [...adminUserKeys.all, "list"] as const,
  list: (params?: UserFilterParams) => [...adminUserKeys.lists(), params] as const,
  details: () => [...adminUserKeys.all, "detail"] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
};

export function useAdminUsers(params?: UserFilterParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => userService.getUsers(params),
  });
}

export function useAdminUserDetail(id: number) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      const currentUser = authService.getCachedUser();
      if (currentUser && currentUser.id === variables.id) {
        authService.setCachedUser(updatedUser);
        queryClient.setQueryData(authKeys.me(), (old: AuthUser | undefined) => {
          return old ? { ...old, ...updatedUser } : updatedUser;
        });
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

