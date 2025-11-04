import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/services/api';
import { authService } from '@/lib/services/auth-service';
import { useAuthStore } from '@/lib/store/auth-store';
import type { RegisterInput } from '@harmonia/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, setLoading, setError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      setAuth(response);

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao Harmonia.io",
        duration: 3000
      });

      router.push('/dashboard');
      return { success: true };
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

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return { register, isSubmitting };
}