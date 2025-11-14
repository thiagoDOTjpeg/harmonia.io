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
import { Music2, Pause, Play, Settings, Trash2 } from "lucide-react";
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
        <Button>
          <Music2 className="mr-2 h-4 w-4" />
          Nova Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {playlists ? (
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      {playlist.sync_status === "completed" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <>Nenhuma playlista sincronizada</>
        )}
      </div>
    </div>
  );
}
