"use client";

import { useStartTour } from "@/components/onboarding-tour";
import DashboardSkeleton from "@/components/skeleton/dashboard-skeleton";
import { useSyncPlaylistMutation } from "@/hooks/mutations";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@harmonia/ui/components/table";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  ListMusic,
  Music2,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const { data: summary, isLoading, refetch, isFetching } = useUserSummary();
  const { user } = useUser();
  const syncMutation = useSyncPlaylistMutation();
  const startTour = useStartTour();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "partial">("all");

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

  // Filtered recent syncs
  const filteredSyncs = useMemo(() => {
    if (!summary?.recent_syncs) return [];
    return summary.recent_syncs.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [summary?.recent_syncs, searchTerm, statusFilter]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Cloudflare Edge Telemetry Ribbon */}
      <div
        data-tour="services-status"
        className="rounded-xl border border-white/[0.08] bg-card/80 p-3 sm:p-4 card-sculpted"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Edge status pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Edge Telemetry:
            </span>

            {/* Worker Pool */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/80 border border-border/80 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-muted-foreground">BullMQ:</span>
              <span className="font-semibold text-foreground">2 Workers</span>
            </div>

            {/* YouTube API Quota */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/80 border border-border/80 font-mono">
              <span
                className={`h-2 w-2 rounded-full ${
                  isYoutubeConnected
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-muted-foreground">YouTube:</span>
              <span className="font-semibold text-foreground">
                {isYoutubeConnected ? "Normal" : "Desconectado"}
              </span>
            </div>

            {/* Spotify Rate-Limit */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/80 border border-border/80 font-mono">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSpotifyConnected
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-muted-foreground">Spotify:</span>
              <span className="font-semibold text-foreground">
                {isSpotifyConnected ? "Saudável" : "Desconectado"}
              </span>
            </div>

            {/* Sync Engine Frequency */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/80 border border-border/80 font-mono">
              <RefreshCw className="h-3 w-3 text-harmonia-lime" />
              <span className="text-muted-foreground">Ciclo:</span>
              <span className="font-semibold text-foreground">24h contínuo</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            {!bothConnected && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/10 text-amber-300 font-mono"
              >
                <Link href="/dashboard/configuracoes">Conectar Serviços →</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground font-mono cursor-pointer"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 text-harmonia-lime ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Enterprise KPI Cards */}
      <div
        data-tour="dashboard-kpis"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* KPI 1 */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Playlists Ativas
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
              <ListMusic className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                {syncedPlaylists}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                / {totalPlaylists} cadastradas
              </span>
            </div>
            <div className="space-y-1">
              <Progress value={playlistSyncRate} className="h-1 bg-muted" />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Taxa de Ativação</span>
                <span className="text-foreground font-semibold">{playlistSyncRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Músicas no Spotify
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
              <Music2 className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                {syncedSongs.toLocaleString("pt-BR")}
              </span>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono py-0"
              >
                +{summary?.synced_songs_last_7_days ?? 0}/sem
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              faixas oficiais pareadas no Spotify
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Precisão do Algoritmo
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                {matchRate}%
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-harmonia-lime/10 text-harmonia-lime border border-harmonia-lime/20">
                Alta Fidelidade
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {totalSongs.toLocaleString("pt-BR")} títulos processados
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Última Varredura
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="text-lg sm:text-xl font-bold font-mono tracking-tight text-foreground truncate">
              {summary?.last_sync_at
                ? `${formatTimeAgo(summary.last_sync_at)} atrás`
                : "Aguardando"}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span>Pipeline operacional</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cloudflare-Style Playlists Enterprise Data Table */}
      <Card
        data-tour="recent-activity"
        className="card-sculpted border border-white/[0.08] shadow-lg"
      >
        <CardHeader className="p-4 sm:p-5 border-b border-border/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  Playlists Gerenciadas
                </CardTitle>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/80">
                  {summary?.recent_syncs?.length ?? 0} zonas ativas
                </span>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Estado de sincronização contínua entre YouTube e Spotify em tempo real.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                asChild
                size="sm"
                className="h-8 px-3 text-xs bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 shadow-xs"
              >
                <Link href="/dashboard/nova">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Nova Sincronização
                </Link>
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar por nome da playlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8.5 pr-3 rounded-md bg-background/80 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harmonia-lime/60 focus:ring-1 focus:ring-harmonia-lime/30 font-mono"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas ({summary?.recent_syncs?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("completed")}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === "completed"
                    ? "bg-card text-emerald-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sincronizadas
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("partial")}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === "partial"
                    ? "bg-card text-amber-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Revisão Pendente
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredSyncs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="w-[120px] text-[10px] font-mono uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                      Playlist / Origem
                    </TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                      Pipeline
                    </TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider text-right">
                      Faixas
                    </TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider">
                      Última Varredura
                    </TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSyncs.map((sync) => (
                    <TableRow
                      key={sync.id}
                      className="border-border/50 hover:bg-muted/30 transition-colors group"
                    >
                      {/* Status */}
                      <TableCell className="font-mono text-xs">
                        {sync.status === "completed" ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="relative flex h-2 w-2">
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            <span>Ativa</span>
                          </div>
                        ) : sync.status === "partial" ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            <span>Quarentena</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                            <span className="h-2 w-2 rounded-full bg-zinc-400" />
                            <span>Processando</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Name & ID */}
                      <TableCell>
                        <Link
                          href={`/dashboard/playlists/${sync.id}`}
                          className="font-semibold text-xs text-foreground group-hover:text-harmonia-lime transition-colors block truncate max-w-[240px]"
                        >
                          {sync.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground mt-0.5">
                          <span>ID:</span>
                          <span className="truncate max-w-[120px]">{sync.id}</span>
                        </div>
                      </TableCell>

                      {/* Pipeline Origin -> Target */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <Video className="h-3 w-3" />
                            YT
                          </span>
                          <ArrowRight className="h-3 w-3 text-zinc-600" />
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <Music2 className="h-3 w-3" />
                            Spotify
                          </span>
                        </div>
                      </TableCell>

                      {/* Songs Count */}
                      <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
                        {sync.songs_count}
                      </TableCell>

                      {/* Last Synced */}
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(sync.last_synced_at)} atrás
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px] font-mono border-border/80 hover:border-harmonia-lime/50"
                          >
                            <Link href={`/dashboard/playlists/${sync.id}`}>
                              Gerenciar
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-14 text-center px-4">
              <div className="h-14 w-14 rounded-2xl bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime mx-auto mb-3">
                <HarmoniaMark className="h-7 w-auto text-harmonia-lime" animated={true} />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                {searchTerm
                  ? "Nenhuma playlist encontrada para a busca"
                  : "Nenhuma playlist sincronizada ainda"}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 leading-relaxed font-mono">
                {searchTerm
                  ? "Tente buscar por outro termo ou limpe o campo de busca."
                  : "Adicione sua primeira playlist pública do YouTube para sincronizar com o Spotify."}
              </p>
              {!searchTerm && (
                <Button
                  asChild
                  size="sm"
                  className="bg-harmonia-lime text-harmonia-green font-bold text-xs"
                >
                  <Link href="/dashboard/nova">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Criar Primeira Sincronização
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cloudflare-Style Live Engine Event Log Stream */}
      <Card className="card-sculpted border border-white/[0.08] bg-[#090e0b]">
        <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-harmonia-lime" />
            <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Harmonia Engine Live Stream
            </CardTitle>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Event Bus Ativo
          </span>
        </CardHeader>
        <CardContent className="p-4 font-mono text-xs space-y-2 text-zinc-400">
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">[00:00:01]</span>
            <span className="text-harmonia-lime font-semibold">[ENGINE]</span>
            <span className="text-zinc-300">
              Worker pool operacional com 2 instâncias ativas (BullMQ + Redis).
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">[00:00:03]</span>
            <span className="text-emerald-400 font-semibold">[AUTH]</span>
            <span className="text-zinc-300">
              YouTube Data API v3 &amp; Spotify Web API autenticadas com sucesso via OAuth 2.0 PKCE.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">[00:00:07]</span>
            <span className="text-sky-400 font-semibold">[TELEMETRY]</span>
            <span className="text-zinc-300">
              {totalPlaylists} playlist{totalPlaylists === 1 ? "" : "s"} sob monitoramento contínuo. Taxa média de match: {matchRate}%.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
