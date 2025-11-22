"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/use-user";
import { formatFullDate } from "@/lib/utils";
import {
  OAuthMethod,
  ServiceConnectionDTO,
  ServiceProvider,
} from "@harmonia/shared";
import {
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Unplug,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceProvider;
}

const SCOPES = {
  [ServiceProvider.GOOGLE]: {
    openid: "Identificar sua conta",
    email: "Acessar seu endereço de e-mail",
    profile: "Visualizar informações básicas do perfil",
    "https://www.googleapis.com/auth/youtube.readonly":
      "Visualizar seus dados do YouTube (playlists, vídeos e canais)",
  },
  [ServiceProvider.SPOTIFY]: {
    "playlist-read-private": "Acessar suas playlists privadas",
    "playlist-read-collaborative": "Acessar suas playlists colaborativas",
    "playlist-modify-private": "Gerenciar suas playlists privadas",
    "playlist-modify-public": "Gerenciar suas playlists públicas",
    "user-read-email": "Acessar seu endereço de e-mail",
  },
};

export function ServiceConnectionDialog({
  open,
  onOpenChange,
  service,
}: ServiceConnectionDialogProps) {
  const { getServiceConnections, _hasHydrated, serviceConnections } = useUser();
  const { openOAuthPopup } = useAuthContext();
  const [selectedService, setSelectedService] =
    useState<ServiceConnectionDTO>();
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hasScope = (scopeKey: string): boolean => {
    if (!selectedService?.scopes) return false;

    try {
      const userScopes = selectedService.scopes.split(" ");
      return userScopes.includes(scopeKey);
    } catch (error) {
      console.error("Error parsing scopes:", error);
      return false;
    }
  };

  useEffect(() => {
    if (_hasHydrated && !serviceConnections) {
      getServiceConnections();
    }

    const connection = serviceConnections?.find(
      (serviceConnection) => serviceConnection.provider === service
    );

    setSelectedService(connection);
    setIsConnected(!!connection);
  }, [_hasHydrated, serviceConnections, getServiceConnections, service]);

  const serviceConfig = {
    [ServiceProvider.GOOGLE]: {
      name: "YouTube",
      color: "text-accent",
      bgColor: "bg-white/75",
      icon: (
        <svg
          className="h-6 w-6 text-red-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    [ServiceProvider.SPOTIFY]: {
      name: "Spotify",
      color: "text-primary",
      bgColor: "bg-primary/20",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
  };

  const config = serviceConfig[service];

  const handleDisconnect = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnected(false);
    setIsLoading(false);
  };

  const handleReauthorize = async () => {
    setIsLoading(true);
    // Simulate reauthorization
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`h-12 w-12 rounded-xl ${config.bgColor} flex items-center justify-center ${config.color}`}
            >
              {config.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">
                Gerenciar{" "}
                {service.charAt(0).toLocaleUpperCase() + service.slice(1)}
              </DialogTitle>
              <DialogDescription>
                {isConnected ? "Conexão ativa" : "Não conectado"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Status da Conexão</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "Conectado e funcionando" : "Desconectado"}
                </p>
              </div>
            </div>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="uppercase tracking-wider text-xs"
            >
              {isConnected ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {/* Connected Account Info */}
          {isConnected && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Informações da Conta
              </h4>
              <div className="space-y-2 p-4 rounded-lg border border-border bg-background/50">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">
                    {selectedService?.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Conectado desde
                  </span>
                  <span className="text-sm font-medium">
                    {formatFullDate(selectedService?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Permissões Necessárias
            </h4>
            <div className="space-y-2">
              {Object.entries(SCOPES[service]).map(([key, description]) => {
                const isGranted = hasScope(key);

                return (
                  <div key={key} className="flex items-start gap-2 text-sm">
                    {isGranted ? (
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span
                      className={
                        isGranted ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleReauthorize}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Reautorizar Conexão
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-destructive hover:text-destructive"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  <Unplug className="mr-2 h-4 w-4" />
                  Desconectar {config.name}
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => openOAuthPopup(service, OAuthMethod.connect)}
                disabled={isLoading}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Conectar {config.name}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Suas credenciais são armazenadas de forma segura e criptografada.
            Você pode revogar o acesso a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
