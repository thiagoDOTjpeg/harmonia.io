"use client";

import DashboardSkeleton from "@/components/skeleton/dashboard-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { formatTimeAgo } from "@/lib/utils";
import { AlertCircle, Clock, Music2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const { getSummary, isLoading, summary, _hasHydrated } = useUser();

  useEffect(() => {
    if (_hasHydrated && !summary) {
      getSummary();
    }
  }, [_hasHydrated, summary]);

  if (!_hasHydrated) {
    return <DashboardSkeleton />;
  }

  const servicesDisconnected =
    !isLoading &&
    summary &&
    (!summary.is_youtube_connected || !summary.is_spotify_connected);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está um resumo da sua conta.
        </p>
      </div>

      {servicesDisconnected && (
        <Alert className="border-yellow-500/40 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500">
            Serviços não conectados
          </AlertTitle>
          <AlertDescription>
            {!summary.is_youtube_connected && !summary.is_spotify_connected
              ? "YouTube e Spotify precisam estar conectados para sincronizar playlists. "
              : !summary.is_youtube_connected
                ? "YouTube precisa estar conectado para importar playlists. "
                : "Spotify precisa estar conectado para receber as músicas. "}
            <Link
              href="/dashboard/configuracoes"
              className="underline font-medium"
            >
              Conectar na aba Integrações →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-xs text-muted-foreground mt-1">
              playlists no total
            </p>
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
              +{summary?.synced_songs_last_7_days ?? 0} esta semana
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
            <div className="text-2xl font-bold">
              {summary?.last_sync_at
                ? `${formatTimeAgo(summary.last_sync_at)} atrás`
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              última atividade registrada
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Suas últimas sincronizações</CardDescription>
        </CardHeader>
        <CardContent>
          {summary?.recent_syncs && summary.recent_syncs.length > 0 ? (
            <div className="space-y-4">
              {summary.recent_syncs.map((activity, index) => (
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
                        {activity.songs_count} músicas •{" "}
                        {formatTimeAgo(activity.last_synced_at)} atrás
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {activity.status === "completed"
                      ? "Sincronizado"
                      : "Sincronização Parcial"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Music2 className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium mb-1">Nenhuma atividade ainda</p>
              <p className="text-sm text-muted-foreground mb-4">
                Suas sincronizações vão aparecer aqui após a primeira execução
              </p>
              <Link
                href="/dashboard/nova"
                className="text-sm text-primary underline"
              >
                Criar primeira sincronização →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
