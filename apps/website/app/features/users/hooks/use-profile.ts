import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "~/services/user.service";
import { authService } from "~/services/auth.service";
import type { UpdatePasswordData, UpdateProfileData } from "~/types/user.types";
import { authKeys } from "~/features/auth/hooks/use-auth";
import type { AuthUser } from "~/types/auth.types";

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => userService.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      authService.setCachedUser(updatedUser);
      queryClient.setQueryData(authKeys.me(), (old: AuthUser | undefined) => {
        return old ? { ...old, ...updatedUser } : updatedUser;
      });
      queryClient.setQueryData(profileKeys.me(), updatedUser);
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => userService.updatePassword(data),
  });
}

