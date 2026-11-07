import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRequestAccessMutation,
  useRequestResetPasswordMutation,
  useResetPasswordMutation,
  useSetPasswordMutation,
} from "@/hooks/mutations/use-auth-mutations";
import { setOnUnauthorizedCallback } from "@/lib/services/api";
import {
  LoginDTO,
  RegisterDTO,
  RequestAccessDTO,
  RequestResetPasswordDTO,
  ResetPasswordDTO,
  SetPasswordDTO,
} from "@harmonia/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useOAuthPopup } from "./use-oauth-popup";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openOAuthPopup, isLoading: oauthLoading } = useOAuthPopup();

  useEffect(() => {
    // Cleanup legacy localStorage keys if present
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("harmonia:token");
    localStorage.removeItem("harmonia:user");

    setOnUnauthorizedCallback(() => {
      queryClient.clear();
      if (
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/dashboard") ||
          window.location.pathname.startsWith("/definir-senha"))
      ) {
        router.push("/login");
      }
    });

    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, [queryClient, router]);

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.push("/login");
    },
  });

  const requestAccessMutation = useRequestAccessMutation();

  const setPasswordMutation = useSetPasswordMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const requestResetPasswordMutation = useRequestResetPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const requestAccess = async (data: RequestAccessDTO) => {
    try {
      await requestAccessMutation.mutateAsync(data);
    } catch {
      return { error: true };
    }
  };

  const setPassword = async (data: SetPasswordDTO) => {
    try {
      await setPasswordMutation.mutateAsync(data);
    } catch {
      return { error: true };
    }
  };

  const requestResetPassword = async (data: RequestResetPasswordDTO) => {
    try {
      await requestResetPasswordMutation.mutateAsync(data);
    } catch {
      return { error: true };
    }
  };

  const resetPassword = async (data: ResetPasswordDTO) => {
    try {
      await resetPasswordMutation.mutateAsync(data);
    } catch {
      return { error: true };
    }
  };

  const login = async (data: LoginDTO) => {
    try {
      await loginMutation.mutateAsync(data);
      return { success: true };
    } catch {
      return undefined;
    }
  };

  const register = async (data: RegisterDTO) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch {
      return undefined;
    }
  };

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    requestAccessMutation.isPending ||
    setPasswordMutation.isPending ||
    requestResetPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    oauthLoading;

  return {
    register,
    login,
    logout,
    requestAccess,
    openOAuthPopup,
    setPassword,
    requestResetPassword,
    resetPassword,
    isLoading,
  };
}
