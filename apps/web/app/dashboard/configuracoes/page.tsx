"use client";

import { ServiceConnectionDialog } from "@/components/service-connection-dialog";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@harmonia/ui/components/tabs";
import { useUserSummary } from "@/hooks/queries";
import { useUser } from "@/hooks/use-user";
import { ServiceProvider } from "@harmonia/shared";
import { ExternalLink, Heart, Music, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConfiguracoesPage() {
  const { user } = useUser();
  const { data: summary, isLoading } = useUserSummary();
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

      <Tabs defaultValue="conta">
        <TabsList className="mb-6">
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="suporte">Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="conta">
          <Card className="max-w-lg">
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
        </TabsContent>

        <TabsContent value="integracoes">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Contas Conectadas</CardTitle>
              <CardDescription>
                Gerencie suas conexões com YouTube e Spotify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
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
        </TabsContent>

        <TabsContent value="suporte">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Apoie o Projeto
              </CardTitle>
              <CardDescription>
                Ajude a manter o Harmonia.io funcionando
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O Harmonia.io é um projeto open source gratuito. Se você acha
                útil, considere apoiar o desenvolvimento com uma contribuição!
              </p>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ServiceConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
