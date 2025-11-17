import { ApiError } from "@/lib/services/api";
import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUserStore } from "@/lib/store/user-store";
import { LoginInput, RegisterInput, RequestResetPasswordInput, ResetPasswordInput } from "@harmonia/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOAuthPopup } from "./use-oauth-popup";
import { toast } from "./use-toast";

export function useAuth() {
  const router = useRouter();
  const { setToken, clearAuth } = useAuthStore();
  const { setUser, clearUser } = useUserStore();
  const { openOAuthPopup, isLoading: oauthLoading } = useOAuthPopup();
  const [isLoading, setIsLoading] = useState(false);

  const requestResetPassword = async (data: RequestResetPasswordInput) => {
    setIsLoading(true);

    try {
      await authService.requestResetPassword(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao fazer login",
        description: "Ocorreu um erro fazer o pedido de reset de senha",
        duration: 5000
      })
      return { error: true }
    } finally {
      setIsLoading(false);
    }
  }

  const resetPassword = async (data: ResetPasswordInput) => {
    setIsLoading(true);

    try {
      await authService.resetPassword(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao fazer login",
        description: "Ocorreu um erro fazer o pedido de reset de senha",
        duration: 5000
      })
      return { error: true }
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data);
      setUser(response.user)
      setToken(response.token)

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) ao Harmonia.io",
        duration: 3000
      })

      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error instanceof ApiError) {
        switch (error.code) {
          case 'missing_email_or_password':
            errorMessage = 'O email e senha precisam ser preenchidos'
            break;
          case 'invalid_credentials':
            errorMessage = 'Senha ou email estão errados'
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        variant: 'destructive',
        title: "Erro ao fazer login",
        description: errorMessage,
        duration: 5000
      })
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    clearAuth();
    clearUser();
    router.push("/login");
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      const response = await authService.register(data);
      setUser(response.user)
      setToken(response.token)

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao Harmonia.io",
        duration: 3000
      });

      router.push('/dashboard');
    } catch (error) {
      let errorMessage = 'Erro ao criar conta. Tente novamente.';

      if (error instanceof ApiError) {
        switch (error.code) {
          case 'email_already_exists':
            errorMessage = 'Este email já está cadastrado';
            break;
          case 'invalid_email':
            errorMessage = 'Email inválido';
            break;
          case 'weak_password':
            errorMessage = 'Senha muito fraca';
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: errorMessage,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };
  return {
    register,
    login,
    logout,
    openOAuthPopup,
    requestResetPassword,
    resetPassword,
    isLoading: isLoading || oauthLoading
  }
}