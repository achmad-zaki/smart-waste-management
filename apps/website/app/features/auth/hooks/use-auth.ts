import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "~/services/auth.service";
import type {
  AuthResponseData,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "~/types/auth.types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/**
 * Hook to retrieve the currently authenticated user from Laravel Sanctum.
 */
export function useCurrentUser() {
  const hasToken = typeof window !== "undefined" && !!authService.getToken();
  const cachedUser = authService.getCachedUser();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    enabled: hasToken,
    initialData: cachedUser || undefined,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for authenticating user (login).
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data: AuthResponseData) => {
      authService.setAuth(data);
      queryClient.setQueryData(authKeys.me(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    },
  });
}

/**
 * Hook for registering a new citizen account.
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data: AuthResponseData) => {
      authService.setAuth(data);
      queryClient.setQueryData(authKeys.me(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      navigate("/user/dashboard");
    },
  });
}

/**
 * Hook for logging out the current user.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      authService.clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      navigate("/login");
    },
  });
}

/**
 * Unified auth helper hook.
 */
export function useAuth() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const token = authService.getToken();
  const isAuthenticated = !!token && !isError;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

