"use client";

import { Badge } from "@harmonia/ui/components/badge";
import { Button } from "@harmonia/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@harmonia/ui/components/dialog";
import { Input } from "@harmonia/ui/components/input";
import { ScrollArea } from "@harmonia/ui/components/scroll-area";
import { Skeleton } from "@harmonia/ui/components/skeleton";
import { useMatchTrackMutation } from "@/hooks/mutations";
import { useTrackCandidates } from "@/hooks/queries";
import {
  PlaylistTrackItemDTO,
  SpotifyTrackCandidateDTO,
} from "@harmonia/shared";
import {
  Check,
  Database,
  ExternalLink,
  Music2,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface TrackMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  item: PlaylistTrackItemDTO | null;
}

function formatDuration(ms: number | null): string {
  if (!ms || ms <= 0) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackMatchDialog({
  open,
  onOpenChange,
  playlistId,
  item,
}: TrackMatchDialogProps) {
  const [searchInput, setSearchInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>(
    undefined
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<SpotifyTrackCandidateDTO | null>(null);

  const trackId = item?.track.id || "";

  const {
    data: candidatesData,
    isLoading,
    isFetching,
  } = useTrackCandidates(playlistId, trackId, submittedQuery, {
    enabled: open && Boolean(trackId),
  });

  const matchTrackMutation = useMatchTrackMutation();

  useEffect(() => {
    if (open && item) {
      setSearchInput("");
      setSubmittedQuery(undefined);
      setSelectedCandidate(null);
    }
  }, [open, item]);

  useEffect(() => {
    if (
      candidatesData?.candidates &&
      candidatesData.candidates.length > 0 &&
      !selectedCandidate
    ) {
      const existingMatch = candidatesData.candidates.find(
        (c) => c.trackId === item?.track.spotify_track_id
      );
      setSelectedCandidate(existingMatch || candidatesData.candidates[0]);
    }
  }, [candidatesData, item, selectedCandidate]);

  if (!item) return null;

  const { track } = item;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSelectedCandidate(null);
    setSubmittedQuery(searchInput.trim() || undefined);
  };

  const handleResetToSuggestions = () => {
    setSearchInput("");
    setSelectedCandidate(null);
    setSubmittedQuery(undefined);
  };

  const handleConfirmMatch = async (syncNow: boolean) => {
    if (!selectedCandidate) return;

    await matchTrackMutation.mutateAsync({
      playlistId,
      trackId: track.id,
      data: {
        spotifyTrackId: selectedCandidate.trackId,
        spotifyUri: selectedCandidate.uri,
        spotifyArtist: `${selectedCandidate.name} — ${selectedCandidate.artist}`,
        spotifyAlbum: selectedCandidate.album,
        syncNow,
      },
    });

    onOpenChange(false);
  };

  const candidates = candidatesData?.candidates || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[92vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Music2 className="h-5 w-5 text-primary" />
            Vincular Música no Spotify
          </DialogTitle>
          <DialogDescription>
            Escolha entre os possíveis matches encontrados ou busque/cole o link
            da música certa no Spotify. O vínculo ficará salvo no banco de dados
            para as próximas sincronizações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={`https://i.ytimg.com/vi/${track.youtube_video_id}/mqdefault.jpg`}
                alt={track.youtube_title}
                className="h-14 w-24 rounded object-cover shrink-0 bg-muted"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-red-500/40 text-red-500"
                  >
                    YouTube
                  </Badge>
                  {track.youtube_channel && (
                    <span className="text-xs text-muted-foreground truncate">
                      {track.youtube_channel}
                    </span>
                  )}
                </div>
                <p
                  className="font-medium text-sm truncate mt-1"
                  title={track.youtube_title}
                >
                  {track.youtube_title}
                </p>
                {track.spotify_track_id && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Match atual:{" "}
                    <span className="text-foreground font-medium">
                      {track.spotify_artist}
                    </span>{" "}
                    ({track.spotify_album})
                  </p>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="shrink-0">
              <a
                href={`https://www.youtube.com/watch?v=${track.youtube_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-1.5 h-3.5 w-3.5 text-red-500" />
                Ouvir no YouTube
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nome/artista ou colar link/URI do Spotify (open.spotify.com/track/...)"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={isFetching}>
              Buscar
            </Button>
            {submittedQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleResetToSuggestions}
                title="Voltar para sugestões automáticas"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </form>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {submittedQuery
                ? `Resultados da busca por "${submittedQuery}"`
                : "Possíveis matches sugeridos"}
            </span>
            {candidatesData?.generatedQuery && !submittedQuery && (
              <span className="truncate max-w-[320px]">
                Query: <code>{candidatesData.generatedQuery}</code>
              </span>
            )}
          </div>

          <ScrollArea className="h-[290px] rounded-lg border border-border">
            <div className="p-3 space-y-2">
              {isLoading || isFetching ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                  >
                    <Skeleton className="h-12 w-12 rounded shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : candidates.length > 0 ? (
                candidates.map((candidate) => {
                  const isSelected =
                    selectedCandidate?.trackId === candidate.trackId;
                  const isCurrentSaved =
                    track.spotify_track_id === candidate.trackId;
                  const scorePercent = Math.round(candidate.matchScore * 100);

                  return (
                    <div
                      key={candidate.trackId}
                      onClick={() => setSelectedCandidate(candidate)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {candidate.imageUrl ? (
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.album}
                            className="h-12 w-12 rounded object-cover shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <Music2 className="h-6 w-6 text-primary" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm truncate">
                              {candidate.name}
                            </p>
                            {isCurrentSaved && (
                              <Badge variant="secondary" className="text-[10px]">
                                Atual
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {candidate.artist} • {candidate.album}
                            {candidate.durationMs
                              ? ` • ${formatDuration(candidate.durationMs)}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            scorePercent >= 80
                              ? "default"
                              : scorePercent >= 60
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {scorePercent}% similar
                        </Badge>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(candidate.externalUrl, "_blank");
                          }}
                          title="Abrir faixa no Spotify"
                        >
                          <ExternalLink className="h-4 w-4 text-green-500" />
                        </Button>

                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Music2 className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">
                    Nenhuma música encontrada no Spotify
                  </p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Tente buscar pelo nome da música ou artista no campo acima,
                    ou cole diretamente o link da música do Spotify.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between items-stretch sm:items-center pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={matchTrackMutation.isPending}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={!selectedCandidate || matchTrackMutation.isPending}
              onClick={() => handleConfirmMatch(false)}
              className="w-full sm:w-auto"
            >
              <Database className="mr-2 h-4 w-4" />
              Salvar p/ Próximo Sync
            </Button>

            <Button
              type="button"
              disabled={!selectedCandidate || matchTrackMutation.isPending}
              onClick={() => handleConfirmMatch(true)}
              className="w-full sm:w-auto"
            >
              <Zap className="mr-2 h-4 w-4" />
              {matchTrackMutation.isPending
                ? "Salvando..."
                : "Salvar e Sincronizar Agora"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

