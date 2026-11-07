"use client";

import { useStartTour } from "@/components/onboarding-tour";
import DashboardSkeleton from "@/components/skeleton/dashboard-skeleton";
import { useUserSummary } from "@/hooks/queries";
import { useUser } from "@/hooks/use-user";
import { formatTimeAgo } from "@/lib/utils";
import { HarmoniaMark } from "@harmonia/ui";
import { Badge } from "@harmonia/ui/components/badge";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import { Progress } from "@harmonia/ui/components/progress";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ListMusic,
  Music2,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: summary, isLoading } = useUserSummary();
  const { user } = useUser();
  const startTour = useStartTour();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const firstName = user?.name ? user.name.split(" ")[0] : "Músico";

  const isYoutubeConnected = summary?.is_youtube_connected ?? false;
  const isSpotifyConnected = summary?.is_spotify_connected ?? false;
  const bothConnected = isYoutubeConnected && isSpotifyConnected;

  const totalSongs = summary?.total_songs ?? 0;
  const syncedSongs = summary?.synced_songs ?? 0;
  const matchRate =
    totalSongs > 0 ? Math.min(100, Math.round((syncedSongs / totalSongs) * 100)) : 100;

  const totalPlaylists = summary?.total_playlists ?? 0;
  const syncedPlaylists = summary?.synced_playlists ?? 0;
  const playlistSyncRate =
    totalPlaylists > 0
      ? Math.min(100, Math.round((syncedPlaylists / totalPlaylists) * 100))
      : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Olá, {firstName}!
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Central de sincronização contínua e automação de playlists.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startTour}
            className="border-border/80 hover:border-harmonia-lime/50 text-xs font-medium cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-harmonia-lime mr-1.5" />
            Tour Guiado
          </Button>

          <Button
            asChild
            size="sm"
            data-tour="quick-new-sync"
            className="bg-harmonia-lime text-harmonia-green hover:brightness-105 active:scale-95 transition-all font-semibold text-xs shadow-sm"
          >
            <Link href="/dashboard/nova">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Nova Sincronização
            </Link>
          </Button>
        </div>
      </div>

      {/* Integration Pipeline Banner */}
      <div
        data-tour="services-status"
        className="rounded-xl border border-white/[0.08] bg-card p-4 sm:p-5 card-sculpted"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Pipeline de Serviços:
            </span>

            {/* YouTube Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 border border-border/80">
              <div
                className={`h-2 w-2 rounded-full ${
                  isYoutubeConnected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-xs font-medium">YouTube</span>
              {isYoutubeConnected ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] text-amber-400 font-medium">
                  Desconectado
                </span>
              )}
            </div>

            <div className="flex items-center text-muted-foreground px-1">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>

            {/* Spotify Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 border border-border/80">
              <div
                className={`h-2 w-2 rounded-full ${
                  isSpotifyConnected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-xs font-medium">Spotify</span>
              {isSpotifyConnected ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] text-amber-400 font-medium">
                  Desconectado
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {bothConnected ? (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs py-1"
              >
                <Zap className="h-3 w-3 mr-1 text-emerald-400" />
                Pipeline pronto para sincronização
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Conecte ambos os serviços para sincronizar
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/10 text-amber-300"
                >
                  <Link href="/dashboard/configuracoes">Conectar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Meaningful KPIs */}
      <div
        data-tour="dashboard-kpis"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* KPI 1: Playlists Sincronizadas */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Playlists Sincronizadas
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 flex items-center justify-center text-harmonia-lime">
              <ListMusic className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold tracking-tight">
                {syncedPlaylists}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                de {totalPlaylists} playlist{totalPlaylists === 1 ? "" : "s"} ativa{totalPlaylists === 1 ? "" : "s"}
              </p>
            </div>
            <div className="space-y-1">
              <Progress value={playlistSyncRate} className="h-1.5 bg-muted" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Taxa de ativação</span>
                <span className="font-medium text-foreground">{playlistSyncRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Músicas Sincronizadas */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Músicas no Spotify
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 flex items-center justify-center text-harmonia-lime">
              <Music2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold tracking-tight">
                {syncedSongs.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                faixas importadas com sucesso
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{summary?.synced_songs_last_7_days ?? 0} faixas nesta semana</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Precisão de Correspondência */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Precisão de Match
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 flex items-center justify-center text-harmonia-lime">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold tracking-tight">
                {matchRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalSongs.toLocaleString("pt-BR")} faixas totais analisadas
              </p>
            </div>
            <div className="space-y-1">
              <Progress value={matchRate} className="h-1.5 bg-muted" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Score médio do algoritmo</span>
                <span className="font-medium text-foreground">Excelente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Última Sincronização */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Última Sincronização
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 flex items-center justify-center text-harmonia-lime">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                {summary?.last_sync_at
                  ? `${formatTimeAgo(summary.last_sync_at)} atrás`
                  : "Nenhuma ainda"}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                última verificação do motor
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 text-harmonia-lime" />
              <span>Ciclo automático de 24 horas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card
        data-tour="recent-activity"
        className="card-sculpted border border-white/[0.08]"
      >
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
          <div>
            <CardTitle className="text-lg font-bold">Atividade Recente</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Últimas sincronizações processadas entre YouTube e Spotify
            </CardDescription>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto -ml-3 sm:ml-0"
          >
            <Link href="/dashboard/playlists" className="flex items-center gap-1">
              Ver todas as playlists
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {summary?.recent_syncs && summary.recent_syncs.length > 0 ? (
            <div className="space-y-3">
              {summary.recent_syncs.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/dashboard/playlists/${activity.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 hover:border-harmonia-lime/30 transition-all duration-150"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Music2 className="h-5 w-5 text-harmonia-lime" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm group-hover:text-harmonia-lime transition-colors truncate">
                        {activity.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{activity.songs_count} músicas</span>
                        <span>•</span>
                        <span>YouTube → Spotify</span>
                        <span>•</span>
                        <span>{formatTimeAgo(activity.last_synced_at)} atrás</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <Badge
                      className="text-xs"
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "partial"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {activity.status === "completed"
                        ? "Sincronizado"
                        : activity.status === "partial"
                          ? "Revisão Necessária"
                          : "Em Processamento"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-harmonia-lime group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4">
              <div className="relative mb-5">
                <div className="h-16 w-16 rounded-2xl bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                  <HarmoniaMark className="h-8 w-auto text-harmonia-lime" animated={true} />
                </div>
              </div>
              <h3 className="text-base font-bold mb-1">
                Nenhuma sincronização realizada ainda
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-5 leading-relaxed">
                Adicione sua primeira playlist pública do YouTube para que o Harmonia
                localize as faixas correspondentes e crie a playlist no seu Spotify.
              </p>
              <Button
                asChild
                className="bg-harmonia-lime text-harmonia-green hover:brightness-105 font-semibold text-xs shadow-sm"
              >
                <Link href="/dashboard/nova">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Criar Primeira Sincronização
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
