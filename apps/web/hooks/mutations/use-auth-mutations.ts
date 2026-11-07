import { queryKeys } from "@/hooks/queries/query-keys";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/services/api";
import { authService } from "@/lib/services/auth-service";
import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  RequestAccessDTO,
  RequestResetPasswordDTO,
  ResetPasswordDTO,
  SetPasswordDTO,
} from "@harmonia/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLoginMutation(options?: {
  onSuccess?: (data: AuthResponse) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDTO) => authService.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) ao Harmonia.io",
        duration: 3000,
      });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error instanceof ApiError) {
        switch (error.code) {
          case "missing_email_or_password":
            errorMessage = "O email e senha precisam ser preenchidos";
            break;
          case "invalid_credentials":
            errorMessage = "Senha ou email estão errados";
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}

export function useRegisterMutation(options?: {
  onSuccess?: (data: AuthResponse) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao Harmonia.io",
        duration: 3000,
      });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      let errorMessage = "Erro ao criar conta. Tente novamente.";

      if (error instanceof ApiError) {
        switch (error.code) {
          case "email_already_exists":
            errorMessage = "Este email já está cadastrado";
            break;
          case "invalid_email":
            errorMessage = "Email inválido";
            break;
          case "weak_password":
            errorMessage = "Senha muito fraca";
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}

export function useLogoutMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear();
      options?.onSuccess?.();
    },
  });
}

export function useRequestAccessMutation() {
  return useMutation({
    mutationFn: (data: RequestAccessDTO) => authService.requestAccess(data),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao fazer o pedido de acesso",
        description: "Ocorreu um erro fazer o pedido de acesso ao sistema",
        duration: 5000,
      });
    },
  });
}

export function useSetPasswordMutation(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (data: SetPasswordDTO) => authService.setPassword(data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao definir senha",
        description: "Ocorreu um erro ao definir a senha",
        duration: 5000,
      });
    },
  });
}

export function useRequestResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: RequestResetPasswordDTO) =>
      authService.requestResetPassword(data),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro fazer o pedido de reset de senha",
        duration: 5000,
      });
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordDTO) => authService.resetPassword(data),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro fazer o pedido de reset de senha",
        duration: 5000,
      });
    },
  });
}
