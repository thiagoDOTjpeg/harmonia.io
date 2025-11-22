"use client";

import { ServiceConnectionDialog } from "@/components/service-connection-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { ServiceProvider } from "@harmonia/shared";
import { ExternalLink, Heart, Music, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConfiguracoesPage() {
  const { user, summary, getSummary, _hasHydrated, isLoading } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProvider>(
    ServiceProvider.GOOGLE
  );

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (_hasHydrated && !summary) {
      getSummary();
    }
  }, [_hasHydrated, summary, getSummary]);

  const handleManageService = (service: ServiceProvider) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleSave = () => {
    console.log("Salvando:", { name, email });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled
              />
            </div>
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contas Conectadas</CardTitle>
            <CardDescription>
              Gerencie suas conexões com YouTube e Spotify
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div
                className="flex items-center         {/* Card de Conexões */}
gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000]">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">YouTube</p>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Carregando..."
                      : summary?.is_youtube_connected
                        ? "Conectado"
                        : "Não conectado"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleManageService(ServiceProvider.GOOGLE)}
              >
                {summary?.is_youtube_connected ? "Gerenciar" : "Conectar"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954]">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Spotify</p>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Carregando..."
                      : summary?.is_spotify_connected
                        ? "Conectado"
                        : "Não conectado"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleManageService(ServiceProvider.SPOTIFY)}
              >
                {summary?.is_spotify_connected ? "Gerenciar" : "Conectar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative max-w-3xl m-auto h- overflow-hidden col-span-2">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-accent/5 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Apoie o Projeto
            </CardTitle>
            <CardDescription>
              Ajude a manter o Harmonia.io funcionando
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <p className="text-sm text-muted-foreground">
              O Harmonia.io é um projeto open source gratuito. Se você acha
              útil, considere apoiar o desenvolvimento com uma contribuição!
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <a
                  href="https://buymeacoffee.com/harmoniaio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Me a Coffee
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ServiceConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
