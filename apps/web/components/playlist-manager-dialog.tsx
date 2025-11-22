"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlaylist } from "@harmonia/shared";
import { ExternalLink, Music2, Play } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  synced: boolean;
}

interface PlaylistManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: UserPlaylist;
}

export function PlaylistManagerDialog({
  open,
  onOpenChange,
  playlist,
}: PlaylistManagerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {playlist.youtube_title}
          </DialogTitle>
          <DialogDescription>
            Gerencie sua playlist e visualize as músicas sincronizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Platform Links */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://youtube.com/playlist?list=${playlist.youtube_playlist_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 h-4 w-4 text-red-500" />
                Ver no YouTube
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Music2 className="mr-2 h-4 w-4 text-green-500" />
                Ver no Spotify
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>

          {/* Songs List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Músicas ({playlist.songs})
              </h3>
            </div>

            <ScrollArea className="h-[400px] border border-border rounded-lg">
              <div className="p-4 space-y-3"></div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
