import { useAuthStore } from "@/lib/store/auth-store";
import { AuthResponse, OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "./use-toast";
import { useUser } from "./use-user";

export function useOAuthPopup() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const { setServiceConnections, getServiceConnections, setSummary, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false)
  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    popupRef.current = null;
    intervalRef.current = null;
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const expectedOrigin = new URL(apiUrl).origin;

      if (event.origin !== expectedOrigin) return;
      if (!event.data?.type?.startsWith('oauth-')) return;

      console.log('✅ Mensagem OAuth recebida:', event.data);

      if (event.data.type === 'oauth-success') {
        const authData: AuthResponse = event.data.data;
        const method = event.data.method as OAuthMethod;

        if (method === OAuthMethod.connect) {
          toast({
            title: "Serviço conectado!",
            description: "A conexão foi estabelecida com sucesso.",
          });

          setServiceConnections(null);
          setSummary(null);
        } else {
          setUser(authData.user);
          setToken(authData.token);

          toast({
            title: "Autenticação bem-sucedida!",
            description: `Bem-vindo, ${authData.user.name}!`,
          });

          router.push('/dashboard');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: event.data.error || "Ocorreu uma falha durante o processo.",
        });
      }

      cleanup();
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const openOAuthPopup = (provider: ServiceProvider, method: OAuthMethod) => {
    if (isLoading) return;

    const width = 600, height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const returnTo = encodeURIComponent(window.location.origin);

    let url = `${apiUrl}/auth/${provider.toLowerCase()}?intent=${method}&returnTo=${returnTo}`;

    if (method === OAuthMethod.connect) {
      const token = useAuthStore.getState().token;

      if (!token) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar autenticado para conectar serviços."
        });
        return;
      }

      const state = encodeURIComponent(btoa(JSON.stringify({
        method,
        token,
        timestamp: Date.now()
      })));

      url += `&state=${state}`;
    }

    const popup = window.open(url, `oauth-${provider}`, `width=${width},height=${height},left=${left},top=${top}`);

    if (!popup) {
      toast({
        variant: "destructive",
        title: "Popup bloqueado",
        description: "Por favor, permita popups para este site."
      });
      setIsLoading(false);
      return;
    }

    popupRef.current = popup;
    setIsLoading(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (popup.closed) {
        if (isLoading) {
          console.log('Login cancelado pelo usuário.');
          toast({
            variant: "destructive",
            title: "Autenticação cancelada",
          });
        }
        cleanup();
      }
    }, 1000);

  };
  return { openOAuthPopup, isLoading }
}