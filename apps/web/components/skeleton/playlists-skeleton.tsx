import { Music2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

export default function PlaylistsSkeleton() {
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
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                      <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
                  <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
                  <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
