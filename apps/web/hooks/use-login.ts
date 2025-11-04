import { useToast } from '@/hooks/use-toast';
import { ApiError } from "@/lib/services/api";
import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoginInput } from "@harmonia/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, setLoading, setError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (data: LoginInput) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      setAuth(response);

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

      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }
  return { login, isSubmitting }
}