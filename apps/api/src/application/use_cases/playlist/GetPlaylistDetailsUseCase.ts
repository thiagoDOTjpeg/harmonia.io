import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import {
   NotFoundError,
  PlaylistDetailsDTO,
  PlaylistTrackItemDTO,
} from "@harmonia/shared";

export class GetPlaylistDetailsUseCase {
  constructor(private readonly playlistRepository: IPlaylistRepository) {}

  async execute(playlistId: string, userId: string): Promise<PlaylistDetailsDTO> {
    if (!this.playlistRepository.findByIdWithTracks) {
      throw new Error("Method findByIdWithTracks not implemented");
    }

    const playlist = await this.playlistRepository.findByIdWithTracks(playlistId);

    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundError("Playlist não encontrada");
    }

    const tracks: PlaylistTrackItemDTO[] = (playlist.playlistTracks || []).map(
      (pt: any) => {
        const track = pt.track;
        const hasMatch = Boolean(track?.spotifyTrackId);

        let normalizedStatus: "synced" | "pending" | "failed" = "failed";
        if (!hasMatch) {
          normalizedStatus = "failed";
        } else if (pt.status === "synced") {
          normalizedStatus = "synced";
        } else if (pt.status === "pending" && track.matchSource === "auto") {
          normalizedStatus = "synced";
        } else if (pt.status === "pending") {
          normalizedStatus = "pending";
        } else {
          normalizedStatus = "failed";
        }

        return {
          id: pt.id,
          position: pt.position ?? null,
          status: normalizedStatus,
          added_at:
            pt.addedAt instanceof Date
              ? pt.addedAt.toISOString()
              : String(pt.addedAt),
          track: {
            id: track.id,
            youtube_video_id: track.youtubeVideoId,
            youtube_title: track.youtubeTitle,
            youtube_channel: track.youtubeChannel ?? null,
            spotify_track_id: track.spotifyTrackId ?? null,
            spotify_uri: track.spotifyUri ?? null,
            spotify_artist: track.spotifyArtist ?? null,
            spotify_album: track.spotifyAlbum ?? null,
            match_score: track.matchScore ?? 0,
            matched_at:
              track.matchedAt instanceof Date
                ? track.matchedAt.toISOString()
                : track.matchedAt ?? null,
            match_source: track.matchSource ?? null,
          },
        };
      }
    );

    const syncedCount = tracks.filter((t) => t.status === "synced").length;
    const pendingCount = tracks.filter((t) => t.status === "pending").length;
    const failedCount = tracks.filter((t) => t.status === "failed").length;
    const lowConfidenceCount = tracks.filter(
      (t) =>
        Boolean(t.track.spotify_track_id) &&
        t.track.match_source !== "manual" &&
        t.track.match_score > 0 &&
        t.track.match_score < 0.8
    ).length;

    return {
      id: playlist.id,
      user_id: playlist.userId,
      youtube_playlist_id: playlist.youtubePlaylistId,
      youtube_url: playlist.youtubeUrl,
      youtube_title: playlist.youtubeTitle ?? null,
      spotify_playlist_id: playlist.spotifyPlaylistId,
      spotify_url: playlist.spotifyUrl,
      spotify_title: playlist.spotifyTitle ?? null,
      sync_status: playlist.syncStatus,
      last_synced_at:
        playlist.lastSyncedAt instanceof Date
          ? playlist.lastSyncedAt.toISOString()
          : playlist.lastSyncedAt ?? null,
      created_at:
        playlist.createdAt instanceof Date
          ? playlist.createdAt.toISOString()
          : String(playlist.createdAt),
      updated_at:
        playlist.updatedAt instanceof Date
          ? playlist.updatedAt.toISOString()
          : String(playlist.updatedAt),
      stats: {
        total: tracks.length,
        synced: syncedCount,
        pending: pendingCount,
        failed: failedCount,
        low_confidence: lowConfidenceCount,
      },
      tracks,
    };
  }
}

