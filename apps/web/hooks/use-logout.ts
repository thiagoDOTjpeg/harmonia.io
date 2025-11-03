import { ApiError } from '@/lib/services/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const { logout: clearAuth } = useAuthStore();

  const logout = () => {
    try {
      clearAuth();
      router.push('/');
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }

      return { success: false, error: error };
    }
  };
  return { logout };
}
