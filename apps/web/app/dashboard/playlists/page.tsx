"use client";

import PlaylistsSkeleton from "@/components/skeleton/playlists-skeleton";
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
  useDeletePlaylistMutation,
  useSyncPlaylistMutation,
} from "@/hooks/mutations";
import { useUserPlaylists } from "@/hooks/queries";
import { formatTimeAgo } from "@harmonia/shared";
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
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Minhas Playlists</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gerencie suas playlists sincronizadas e ajuste o match das músicas
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto shrink-0">
          <Link href="/dashboard/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Sincronização
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Card key={playlist.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <Link
                      href={`/dashboard/playlists/${playlist.id}`}
                      className="h-16 w-16 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Music2 className="h-8 w-8 text-primary" />
                    </Link>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        <Link
                          href={`/dashboard/playlists/${playlist.id}`}
                          className="hover:underline underline-offset-4"
                        >
                          {playlist.youtube_title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {playlist.songs} músicas • Última sincronização:{" "}
                        {formatTimeAgo(playlist.last_synced_at)}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge
                          variant={
                            playlist.sync_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {playlist.sync_status === "completed"
                            ? "Sincronizada"
                            : playlist.sync_status === "partial"
                              ? "Sincronização Parcial"
                              : "Desincronizada"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                          onClick={() =>
                            window.open(
                              `https://youtube.com/playlist?list=${playlist.youtube_playlist_id}`,
                              "_blank"
                            )
                          }
                        >
                          <Play className="mr-1 h-3 w-3 text-red-500" />
                          YouTube
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-green-500/10 hover:border-green-500/40 transition-colors"
                          onClick={() =>
                            window.open(
                              `https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`,
                              "_blank"
                            )
                          }
                        >
                          <Music2 className="mr-1 h-3 w-3 text-green-500" />
                          Spotify
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
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
                        Resincronizar
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
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardFooter className="pt-0 flex justify-end">
                <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
                  <Link href={`/dashboard/playlists/${playlist.id}`}>
                    <ListMusic className="mr-2 h-4 w-4" />
                    Abrir e Gerenciar Músicas
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="border-dashed col-span-full">
            <CardHeader className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <Music2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">
                Nenhuma playlist encontrada
              </CardTitle>
              <CardDescription className="max-w-md mb-6">
                Comece criando sua primeira playlist ou sincronize suas
                playlists do YouTube para gerenciá-las aqui.
              </CardDescription>
              <Link href="/dashboard/nova">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Playlist
                </Button>
              </Link>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
