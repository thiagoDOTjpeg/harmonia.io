"use client";

import PlaylistsSkeleton from "@/components/skeleton/playlists-skeleton";
import {
  useDeletePlaylistMutation,
  useSyncPlaylistMutation,
} from "@/hooks/mutations";
import { useUserPlaylists } from "@/hooks/queries";
import { formatTimeAgo } from "@harmonia/shared";
import { HarmoniaMark } from "@harmonia/ui";
import { Badge } from "@harmonia/ui/components/badge";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@harmonia/ui/components/dropdown-menu";
import {
  ExternalLink,
  ListMusic,
  MoreHorizontal,
  Music2,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

function PlaylistsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const { data: playlists, isLoading, refetch, isFetching } = useUserPlaylists();
  const syncPlaylistMutation = useSyncPlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "partial">("all");

  const filteredPlaylists = useMemo(() => {
    if (!playlists) return [];
    return playlists.filter((item) => {
      const title = (item.youtube_title || "").toLowerCase();
      const spotifyTitle = (item.spotify_title || "").toLowerCase();
      const id = item.id.toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        title.includes(query) || spotifyTitle.includes(query) || id.includes(query);
      const matchesStatus =
        statusFilter === "all" ? true : item.sync_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [playlists, searchTerm, statusFilter]);

  if (isLoading) {
    return <PlaylistsSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Playlists Sincronizadas
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/80">
              {playlists?.length ?? 0} zonas registradas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Gerencie suas conexões de playlists e execute resincronizações pontuais ou automáticas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-xs font-mono border-border/80 cursor-pointer"
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 text-harmonia-lime ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Atualizar
          </Button>
          <Button
            asChild
            size="sm"
            className="h-8 bg-harmonia-lime text-harmonia-green hover:brightness-105 font-bold text-xs shadow-xs"
          >
            <Link href="/dashboard/nova">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Nova Sincronização
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.08] bg-card/60 backdrop-blur-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8.5 pr-3 rounded-md bg-background/80 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harmonia-lime/60 focus:ring-1 focus:ring-harmonia-lime/30 font-mono"
          />
        </div>

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
            Todas ({playlists?.length ?? 0})
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

      {/* Grid of Enterprise Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <Card
              key={playlist.id}
              className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <Link
                      href={`/dashboard/playlists/${playlist.id}`}
                      className="h-12 w-12 shrink-0 rounded-xl bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Music2 className="h-6 w-6 text-harmonia-lime" />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="truncate text-sm sm:text-base font-bold">
                          <Link
                            href={`/dashboard/playlists/${playlist.id}`}
                            className="hover:text-harmonia-lime transition-colors"
                          >
                            {playlist.youtube_title || "Playlist Sem Nome"}
                          </Link>
                        </CardTitle>
                      </div>

                      <CardDescription className="mt-0.5 text-xs text-muted-foreground font-mono">
                        {playlist.songs} faixas • {formatTimeAgo(playlist.last_synced_at)} atrás
                      </CardDescription>

                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                            playlist.sync_status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : playlist.sync_status === "partial"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              playlist.sync_status === "completed"
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                          />
                          {playlist.sync_status === "completed"
                            ? "Sincronizada"
                            : playlist.sync_status === "partial"
                              ? "Revisão Pendente"
                              : "Desincronizada"}
                        </span>

                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-[10px] font-mono py-0"
                          onClick={() =>
                            window.open(
                              `https://youtube.com/playlist?list=${playlist.youtube_playlist_id}`,
                              "_blank"
                            )
                          }
                        >
                          <Play className="mr-1 h-2.5 w-2.5 text-red-500" />
                          YouTube
                          <ExternalLink className="ml-1 h-2.5 w-2.5" />
                        </Badge>

                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors text-[10px] font-mono py-0"
                          onClick={() =>
                            window.open(
                              `https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`,
                              "_blank"
                            )
                          }
                        >
                          <Music2 className="mr-1 h-2.5 w-2.5 text-emerald-400" />
                          Spotify
                          <ExternalLink className="ml-1 h-2.5 w-2.5" />
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/playlists/${playlist.id}`}
                          className="cursor-pointer"
                        >
                          <ListMusic className="mr-2 h-3.5 w-3.5" />
                          Gerenciar Músicas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={syncPlaylistMutation.isPending}
                        onClick={() =>
                          syncPlaylistMutation.mutate({
                            youtubePlaylistId: playlist.youtube_playlist_id,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Resincronizar Agora
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        disabled={deletePlaylistMutation.isPending}
                        onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Excluir Playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardFooter className="px-4 py-3 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                  ID: {playlist.id}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 text-xs font-medium hover:text-harmonia-lime"
                >
                  <Link href={`/dashboard/playlists/${playlist.id}`}>
                    Ver detalhes e matches →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="card-sculpted border border-white/[0.08] col-span-full">
            <CardHeader className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center mb-4">
                <HarmoniaMark className="h-8 w-auto text-harmonia-lime" animated={true} />
              </div>
              <CardTitle className="text-lg font-bold mb-1">
                {searchTerm
                  ? "Nenhuma playlist encontrada para o filtro"
                  : "Nenhuma playlist sincronizada ainda"}
              </CardTitle>
              <CardDescription className="max-w-md mb-6 text-xs text-muted-foreground font-mono leading-relaxed">
                {searchTerm
                  ? "Tente buscar por outro termo ou limpe o campo de busca."
                  : "Adicione sua primeira playlist pública do YouTube para que o Harmonia replique no Spotify."}
              </CardDescription>
              {!searchTerm && (
                <Button
                  asChild
                  className="bg-harmonia-lime text-harmonia-green hover:brightness-105 font-bold text-xs shadow-xs"
                >
                  <Link href="/dashboard/nova">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Criar Primeira Sincronização
                  </Link>
                </Button>
              )}
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PlaylistsPage() {
  return (
    <Suspense fallback={<PlaylistsSkeleton />}>
      <PlaylistsContent />
    </Suspense>
  );
}
