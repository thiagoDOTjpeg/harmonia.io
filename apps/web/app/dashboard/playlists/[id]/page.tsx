"use client";

import { TrackMatchDialog } from "@/components/track-match-dialog";
import { Badge } from "@harmonia/ui/components/badge";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import { Input } from "@harmonia/ui/components/input";
import { Progress } from "@harmonia/ui/components/progress";
import { Skeleton } from "@harmonia/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@harmonia/ui/components/tabs";
import {
  useMatchTrackMutation,
  useSyncPlaylistMutation,
} from "@/hooks/mutations";
import { usePlaylistDetails } from "@/hooks/queries";
import { formatTimeAgo, PlaylistTrackItemDTO } from "@harmonia/shared";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Music2,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type FilterTab = "all" | "unmatched" | "synced" | "review";

export default function PlaylistManagePage() {
  const params = useParams<{ id: string }>();
  const playlistId = params?.id || "";

  const {
    data: playlist,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePlaylistDetails(playlistId);

  const syncPlaylistMutation = useSyncPlaylistMutation();
  const matchTrackMutation = useMatchTrackMutation();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemForMatch, setSelectedItemForMatch] =
    useState<PlaylistTrackItemDTO | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  const handleOpenMatchDialog = (item: PlaylistTrackItemDTO) => {
    setSelectedItemForMatch(item);
    setMatchDialogOpen(true);
  };

  const handleResyncPlaylist = async () => {
    if (!playlist) return;
    await syncPlaylistMutation.mutateAsync({
      youtubePlaylistId: playlist.youtube_playlist_id,
    });
    setTimeout(() => {
      refetch();
    }, 2000);
  };

  const handleQuickPushToSpotify = async (item: PlaylistTrackItemDTO) => {
    if (
      !playlist ||
      !item.track.spotify_track_id ||
      !item.track.spotify_uri
    ) {
      return;
    }

    await matchTrackMutation.mutateAsync({
      playlistId: playlist.id,
      trackId: item.track.id,
      data: {
        spotifyTrackId: item.track.spotify_track_id,
        spotifyUri: item.track.spotify_uri,
        spotifyArtist: item.track.spotify_artist || "Unknown",
        spotifyAlbum: item.track.spotify_album || "Unknown",
        syncNow: true,
      },
    });
  };

  const filteredTracks = useMemo(() => {
    if (!playlist?.tracks) return [];

    return playlist.tracks.filter((item) => {
      if (activeTab === "unmatched" && item.status === "synced") {
        return false;
      }
      if (activeTab === "synced" && item.status !== "synced") {
        return false;
      }
      if (activeTab === "review") {
        const isLowConfidence =
          Boolean(item.track.spotify_track_id) &&
          item.track.match_source !== "manual" &&
          item.track.match_score > 0 &&
          item.track.match_score < 0.8;
        if (!isLowConfidence) return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesYtTitle = item.track.youtube_title
          .toLowerCase()
          .includes(term);
        const matchesYtChannel = (item.track.youtube_channel || "")
          .toLowerCase()
          .includes(term);
        const matchesSpArtist = (item.track.spotify_artist || "")
          .toLowerCase()
          .includes(term);
        const matchesSpAlbum = (item.track.spotify_album || "")
          .toLowerCase()
          .includes(term);

        return (
          matchesYtTitle ||
          matchesYtChannel ||
          matchesSpArtist ||
          matchesSpAlbum
        );
      }

      return true;
    });
  }, [playlist?.tracks, activeTab, searchTerm]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="p-8 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/playlists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Minhas Playlists
          </Link>
        </Button>

        <Card className="border-dashed">
          <CardHeader className="flex flex-col items-center justify-center py-16 text-center">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl mb-2">
              Playlist não encontrada
            </CardTitle>
            <CardDescription className="max-w-md mb-6">
              Não foi possível carregar os detalhes desta playlist.
            </CardDescription>
            <Button asChild>
              <Link href="/dashboard/playlists">Voltar para Playlists</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { stats } = playlist;
  const unresolvedCount = stats.failed + stats.pending;
  const syncProgressPercent =
    stats.total > 0 ? Math.round((stats.synced / stats.total) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/dashboard/playlists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Minhas Playlists
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Atualizar Lista
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <Music2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                {playlist.youtube_title || "Playlist sem título"}
              </h1>
              <Badge
                variant={
                  playlist.sync_status === "completed"
                    ? "default"
                    : playlist.sync_status === "partial"
                      ? "secondary"
                      : "destructive"
                }
              >
                {playlist.sync_status === "completed"
                  ? "Sincronizada"
                  : playlist.sync_status === "partial"
                    ? "Sincronização Parcial"
                    : playlist.sync_status === "failed"
                      ? "Falha na Sincronização"
                      : "Pendente"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.total} músicas registradas • Última sincronização:{" "}
              {playlist.last_synced_at
                ? `${formatTimeAgo(playlist.last_synced_at)} atrás`
                : "Nunca"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a
              href={
                playlist.youtube_url ||
                `https://www.youtube.com/playlist?list=${playlist.youtube_playlist_id}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="mr-2 h-4 w-4 text-red-500" />
              Abrir no YouTube
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              href={
                playlist.spotify_url ||
                `https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Music2 className="mr-2 h-4 w-4 text-green-500" />
              Abrir no Spotify
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>

          <Button
            size="sm"
            onClick={handleResyncPlaylist}
            disabled={syncPlaylistMutation.isPending}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                syncPlaylistMutation.isPending ? "animate-spin" : ""
              }`}
            />
            {syncPlaylistMutation.isPending
              ? "Sincronizando..."
              : "Sincronizar Novamente"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total de Músicas
            </CardTitle>
            <Music2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              vídeos mapeados da playlist
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Sincronizadas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-green-500">
                {stats.synced}
              </div>
              <span className="text-xs text-muted-foreground">
                {syncProgressPercent}%
              </span>
            </div>
            <Progress value={syncProgressPercent} className="h-1.5" />
          </CardContent>
        </Card>

        <Card
          className={
            unresolvedCount > 0
              ? "border-amber-500/40 bg-amber-500/5 cursor-pointer"
              : ""
          }
          onClick={() => {
            if (unresolvedCount > 0) setActiveTab("unmatched");
          }}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Sem Match / Pendentes
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${
                unresolvedCount > 0
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.failed} sem match • {stats.pending} aguardando sync
            </p>
          </CardContent>
        </Card>

        <Card
          className={stats.low_confidence > 0 ? "cursor-pointer" : ""}
          onClick={() => {
            if (stats.low_confidence > 0) setActiveTab("review");
          }}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Revisão Sugerida
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.low_confidence}</div>
            <p className="text-xs text-muted-foreground mt-1">
              matches automáticos abaixo de 80%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Músicas da Playlist</CardTitle>
              <CardDescription>
                Veja quais músicas sincronizaram, confira possíveis matches no
                Spotify ou indique manualmente a música correta.
              </CardDescription>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por título, canal ou artista..."
                className="pl-9"
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as FilterTab)}
          >
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
              <TabsTrigger value="unmatched" className="gap-1.5">
                Não Encontradas / Pendentes
                {unresolvedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0 text-[10px]"
                  >
                    {unresolvedCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="synced">
                Sincronizadas ({stats.synced})
              </TabsTrigger>
              <TabsTrigger value="review">
                Revisar Similaridade ({stats.low_confidence})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          {filteredTracks.length > 0 ? (
            <div className="divide-y divide-border rounded-lg border border-border">
              {filteredTracks.map((item, idx) => {
                const { track } = item;
                const hasSpotifyMatch = Boolean(track.spotify_track_id);
                const scorePercent = Math.round((track.match_score || 0) * 100);
                const isManual = track.match_source === "manual";

                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <span className="text-xs font-mono text-muted-foreground w-5 sm:w-6 text-right shrink-0">
                        {(item.position ?? idx) + 1}
                      </span>

                      <a
                        href={`https://www.youtube.com/watch?v=${track.youtube_video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group shrink-0"
                        title="Assistir no YouTube"
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${track.youtube_video_id}/mqdefault.jpg`}
                          alt={track.youtube_title}
                          className="h-12 w-20 sm:h-14 sm:w-24 rounded-md object-cover bg-muted border border-border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
                        </div>
                      </a>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className="font-medium text-xs sm:text-sm truncate"
                            title={track.youtube_title}
                          >
                            {track.youtube_title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">
                          <span className="truncate">
                            {track.youtube_channel || "Canal desconhecido"}
                          </span>
                          <span>•</span>
                          <a
                            href={`https://www.youtube.com/watch?v=${track.youtube_video_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:text-foreground underline-offset-2 hover:underline shrink-0"
                          >
                            YouTube
                            <ExternalLink className="ml-1 h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="hidden lg:block h-4 w-4 text-muted-foreground shrink-0" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 flex-1 min-w-0 pl-0 lg:pl-0">
                      {hasSpotifyMatch ? (
                        <div className="min-w-0 flex-1 lg:text-right">
                          <div className="flex items-center lg:justify-end gap-2 flex-wrap">
                            {item.status === "synced" ? (
                              <Badge
                                variant="default"
                                className="bg-green-600 hover:bg-green-600/90 text-white text-[11px]"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Sincronizada
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="border-amber-500/40 bg-amber-500/10 text-amber-500 text-[11px]"
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                Salva p/ próximo sync
                              </Badge>
                            )}

                            <Badge variant="outline" className="text-[11px]">
                              {isManual
                                ? "Definida manualmente"
                                : `${scorePercent}% similar`}
                            </Badge>
                          </div>

                          <div className="mt-1.5 flex items-center lg:justify-end gap-1.5 text-sm">
                            <Music2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            <span
                              className="font-medium truncate"
                              title={track.spotify_artist || ""}
                            >
                              {track.spotify_artist || "Faixa vinculada"}
                            </span>
                            {track.spotify_album && (
                              <span
                                className="text-xs text-muted-foreground truncate hidden sm:inline"
                                title={track.spotify_album}
                              >
                                ({track.spotify_album})
                              </span>
                            )}
                            <a
                              href={`https://open.spotify.com/track/${track.spotify_track_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-green-500 ml-1 shrink-0"
                              title="Abrir faixa no Spotify"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="destructive"
                            className="bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20"
                          >
                            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                            Sem match parecido encontrado
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-2 shrink-0">
                        {hasSpotifyMatch && item.status === "pending" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleQuickPushToSpotify(item)}
                            disabled={matchTrackMutation.isPending}
                            title="Adicionar imediatamente na playlist do Spotify"
                          >
                            <Zap className="mr-1.5 h-3.5 w-3.5" />
                            Sincronizar Agora
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant={hasSpotifyMatch ? "outline" : "default"}
                          onClick={() => handleOpenMatchDialog(item)}
                        >
                          {hasSpotifyMatch ? (
                            <>
                              <Wrench className="mr-1.5 h-3.5 w-3.5" />
                              Alterar Match
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                              Possíveis Matches / Indicar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 border border-dashed border-border rounded-lg">
              <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto">
                <Music2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">
                  {stats.total === 0
                    ? "Nenhuma música registrada nesta playlist ainda"
                    : "Nenhuma música encontrada para este filtro"}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {stats.total === 0
                    ? "Clique em 'Sincronizar Novamente' para buscar todos os vídeos do YouTube e mapear as músicas."
                    : "Tente mudar a aba selecionada ou limpar o termo de busca."}
                </p>
              </div>
              {stats.total === 0 ? (
                <Button
                  onClick={handleResyncPlaylist}
                  disabled={syncPlaylistMutation.isPending}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sincronizar Agora
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("all");
                    setSearchTerm("");
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TrackMatchDialog
        open={matchDialogOpen}
        onOpenChange={setMatchDialogOpen}
        playlistId={playlist.id}
        item={selectedItemForMatch}
      />
    </div>
  );
}

