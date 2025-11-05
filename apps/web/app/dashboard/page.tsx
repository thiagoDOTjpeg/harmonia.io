"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { UserDashboardData } from "@/lib/types/user";
import { Clock, Music2, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { dashboard, isLoading } = useDashboard();
  const [summary, setSummary] = useState<UserDashboardData | null>(null);

  const handleSummaryData = async () => {
    const res = await dashboard();
    if (res) setSummary(res);
  };

  useEffect(() => {
    handleSummaryData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está um resumo da sua conta.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Playlists Sincronizadas
            </CardTitle>
            <Music2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_playlists ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Músicas Sincronizadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.synced_songs ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +23 esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Última Sincronização
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground mt-1">atrás</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground mt-1">
              Renovação em 23 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Comece a sincronizar suas playlists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/nova">
                <Music2 className="mr-2 h-4 w-4" />
                Nova Sincronização
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              asChild
            >
              <Link href="/dashboard/playlists">
                <Clock className="mr-2 h-4 w-4" />
                Ver Minhas Playlists
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar Serviços</CardTitle>
            <CardDescription>Gerencie suas conexões</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">YouTube</p>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Carregando..."
                      : summary?.is_youtube_connected
                        ? "Conectado"
                        : "Desconectado"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Spotify</p>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Carregando..."
                      : summary?.is_spotify_connected
                        ? "Conectado"
                        : "Desconectado"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Suas últimas sincronizações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Músicas Favoritas 2024",
                songs: 45,
                time: "2 horas atrás",
                status: "Concluído",
              },
              {
                name: "Workout Mix",
                songs: 32,
                time: "1 dia atrás",
                status: "Concluído",
              },
              {
                name: "Chill Vibes",
                songs: 28,
                time: "3 dias atrás",
                status: "Concluído",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Music2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.songs} músicas • {activity.time}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-primary font-medium">
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
