"use client";

import PlaylistsSkeleton from "@/components/skeleton/playlists-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { formatTimeAgo } from "@harmonia/shared";
import {
  ExternalLink,
  Music2,
  Pause,
  Play,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PlaylistsPage() {
  const { getPlaylists, playlists, isLoading, _hasHydrated } = useUser();

  useEffect(() => {
    if (_hasHydrated && !playlists) {
      getPlaylists();
    }
  }, [_hasHydrated, playlists]);

  if (!_hasHydrated) {
    return <PlaylistsSkeleton />;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Playlists</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas playlists sincronizadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Card key={playlist.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{playlist.youtube_title}</CardTitle>
                      <CardDescription className="mt-1">
                        {playlist.songs} músicas • Última sincronização:{" "}
                        {formatTimeAgo(playlist.last_synced_at)}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            playlist.sync_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {playlist.sync_status === "completed"
                            ? "Sincronizada"
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {playlist.sync_status === "partial" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500/40 hover:bg-yellow-500/10"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resincronizar
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        {playlist.sync_status === "completed" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Music2 className="mr-2 h-4 w-4" />
                        Gerenciar
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
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
              <Link href={"/dashboard/nova"}>
                <Button>
                  <Music2 className="mr-2 h-4 w-4" />
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
