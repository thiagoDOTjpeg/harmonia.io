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
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function PlaylistsPage() {
  const { data: playlists, isLoading } = useUserPlaylists();
  const syncPlaylistMutation = useSyncPlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();

  if (isLoading) {
    return <PlaylistsSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Minhas Playlists
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gerencie suas playlists sincronizadas e ajuste a correspondência das músicas.
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto shrink-0 bg-harmonia-lime text-harmonia-green hover:brightness-105 font-semibold text-xs shadow-sm"
        >
          <Link href="/dashboard/nova">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nova Sincronização
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className="card-sculpted border border-white/[0.08] hover:border-harmonia-lime/30 transition-all flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <Link
                      href={`/dashboard/playlists/${playlist.id}`}
                      className="h-14 w-14 shrink-0 rounded-xl bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Music2 className="h-7 w-7 text-harmonia-lime" />
                    </Link>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base font-bold">
                        <Link
                          href={`/dashboard/playlists/${playlist.id}`}
                          className="hover:text-harmonia-lime transition-colors"
                        >
                          {playlist.youtube_title || "Playlist Sem Nome"}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs text-muted-foreground">
                        {playlist.songs} músicas • Sincronizada {formatTimeAgo(playlist.last_synced_at)} atrás
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <Badge
                          variant={
                            playlist.sync_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {playlist.sync_status === "completed"
                            ? "Sincronizada"
                            : playlist.sync_status === "partial"
                              ? "Revisão Pendente"
                              : "Desincronizada"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-[11px]"
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
                          className="cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors text-[11px]"
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
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/playlists/${playlist.id}`}>
                          <ListMusic className="mr-2 h-4 w-4" />
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
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resincronizar Agora
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `https://youtube.com/playlist?list=${playlist.youtube_playlist_id}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir no YouTube
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir no Spotify
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        disabled={deletePlaylistMutation.isPending}
                        onClick={() =>
                          deletePlaylistMutation.mutate(playlist.id)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardFooter className="pt-0 flex justify-end border-t border-border/40 mt-4 pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto text-xs font-medium"
                >
                  <Link href={`/dashboard/playlists/${playlist.id}`}>
                    <ListMusic className="mr-1.5 h-3.5 w-3.5 text-harmonia-lime" />
                    Abrir e Gerenciar Músicas
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
              <CardTitle className="text-xl font-bold mb-1">
                Nenhuma playlist encontrada
              </CardTitle>
              <CardDescription className="max-w-md mb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Comece importando sua primeira playlist do YouTube para que o
                Harmonia sincronize tudo automaticamente com seu Spotify.
              </CardDescription>
              <Button
                asChild
                className="bg-harmonia-lime text-harmonia-green hover:brightness-105 font-semibold text-xs shadow-sm"
              >
                <Link href="/dashboard/nova">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Criar Primeira Sincronização
                </Link>
              </Button>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
