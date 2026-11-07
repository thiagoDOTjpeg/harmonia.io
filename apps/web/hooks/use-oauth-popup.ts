import { getApiUrl } from "@/lib/services/api";
import { authService } from "@/lib/services/auth-service";
import { AuthResponse, OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { queryKeys } from "./queries/query-keys";
import { toast } from "@harmonia/ui/hooks/use-toast";

export function useOAuthPopup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
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
    const handleMessage = async (event: MessageEvent) => {
      const configuredUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const allowedOrigins = new Set([
        new URL(configuredUrl).origin,
        getApiUrl(),
      ]);

      if (!allowedOrigins.has(event.origin)) return;
      if (!event.data?.type?.startsWith("oauth-")) return;

      if (event.data.type === "oauth-success") {
        const authData: AuthResponse = event.data.data;
        const method = event.data.data.method as OAuthMethod;

        if (authData.token) {
          await authService.refreshToken(authData.token).catch(() => null);
        }

        switch (method) {
          case OAuthMethod.connect:
            toast({
              title: "Serviço conectado!",
              description: "A conexão foi estabelecida com sucesso.",
            });

            queryClient.invalidateQueries({
              queryKey: queryKeys.user.connections(),
            });
            queryClient.invalidateQueries({
              queryKey: queryKeys.user.summary(),
            });
            break;

          case OAuthMethod.register:
            queryClient.setQueryData(queryKeys.auth.me(), authData.user);

            toast({
              title: "Autenticação bem-sucedida!",
              description: `Bem-vindo, ${authData.user.name}!`,
            });

            setTimeout(() => {
              if (authData.isPasswordSetupRequired) {
                router.push("/definir-senha");
              } else {
                router.push("/dashboard");
              }
            }, 100);
            break;

          case OAuthMethod.login:
            queryClient.setQueryData(queryKeys.auth.me(), authData.user);

            toast({
              title: "Autenticação bem-sucedida!",
              description: `Bem-vindo, ${authData.user.name}!`,
            });

            router.push("/dashboard");
            break;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description:
            event.data.error || "Ocorreu uma falha durante o processo.",
        });
      }

      cleanup();
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      cleanup();
    };
  }, [cleanup, queryClient, router]);

  const openOAuthPopup = (provider: ServiceProvider, method: OAuthMethod) => {
    if (isLoading) return;

    const width = 600,
      height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const apiUrl = getApiUrl();
    const returnTo = encodeURIComponent(window.location.origin);

    const url = `${apiUrl}/auth/${provider.toLowerCase()}?intent=${method}&returnTo=${returnTo}`;

    const popup = window.open(
      url,
      `oauth-${provider}`,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      toast({
        variant: "destructive",
        title: "Popup bloqueado",
        description: "Por favor, permita popups para este site.",
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
          toast({
            variant: "destructive",
            title: "Autenticação cancelada",
          });
        }
        cleanup();
      }
    }, 1000);
  };

  return { openOAuthPopup, isLoading };
}
