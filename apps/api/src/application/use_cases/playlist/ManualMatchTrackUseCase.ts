import { ILogger } from "@/application/ports/logger/ILogger";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "@/application/repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "@/application/repositories/ITrackRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ERRORS } from "@/types/constant/errors";
import {
  MatchTrackDTO,
  MatchTrackResponseDTO,
  NotFoundError,
  ServiceProvider,
} from "@harmonia/shared";

export interface ManualMatchTrackPayload extends MatchTrackDTO {
  playlistId: string;
  trackId: string;
  userId: string;
  connections?: Map<ServiceProvider, ServiceConnection>;
}

export class ManualMatchTrackUseCase {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly playlistTrackRepository: IPlaylistTrackRepository,
    private readonly spotifyMusicClient: ISpotifyMusicClient,
    private readonly logger: ILogger
  ) {}

  async execute(payload: ManualMatchTrackPayload): Promise<MatchTrackResponseDTO> {
    const {
      playlistId,
      trackId,
      userId,
      spotifyTrackId,
      spotifyUri,
      spotifyArtist,
      spotifyAlbum,
      syncNow = true,
      connections,
    } = payload;

    const playlistWithTracks = await this.playlistRepository.findByIdWithTracks?.(
      playlistId
    );

    if (!playlistWithTracks || playlistWithTracks.userId !== userId) {
      throw new NotFoundError("Playlist não encontrada");
    }

    const track = await this.trackRepository.findById?.(trackId);
    if (!track) {
      throw new NotFoundError("Música não encontrada");
    }

    let playlistTrack =
      await this.playlistTrackRepository.findByPlaylistAndTrackId?.(
        playlistId,
        trackId
      );

    if (!playlistTrack) {
      playlistTrack = await this.playlistTrackRepository.create({
        playlistId,
        trackId,
        status: "pending",
      });
    }

    const wasAlreadySyncedWithSameTrack =
      playlistTrack.status === "synced" &&
      track.spotifyTrackId === spotifyTrackId;

    const updatedTrack = await this.trackRepository.updateSpotifyMatch(track.id, {
      spotifyTrackId,
      spotifyUri,
      spotifyArtist,
      spotifyAlbum,
      matchScore: 1.0,
      matchSource: "manual",
    });

    let syncedToSpotify = false;
    let finalTrackStatus: "synced" | "pending" | "failed" = "pending";

    if (syncNow) {
      const spotifyConnection = connections?.get(ServiceProvider.SPOTIFY);
      if (!spotifyConnection) {
        throw new Error(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE);
      }

      if (!wasAlreadySyncedWithSameTrack) {
        await this.spotifyMusicClient.addTracksToPlaylist(
          playlistWithTracks.spotifyPlaylistId,
          [spotifyUri],
          spotifyConnection.accessToken,
          spotifyConnection.providerAccountId || ""
        );
      }

      syncedToSpotify = true;
      finalTrackStatus = "synced";
      await this.playlistTrackRepository.updateStatus(playlistTrack.id, "synced");
    } else {
      finalTrackStatus = "pending";
      await this.playlistTrackRepository.updateStatus(playlistTrack.id, "pending");
    }

    const updatedPlaylistWithTracks =
      await this.playlistRepository.findByIdWithTracks?.(playlistId);
    const allPlaylistTracks: any[] =
      updatedPlaylistWithTracks?.playlistTracks || [];

    const hasUnresolvedTracks = allPlaylistTracks.some((pt: any) => {
      const hasMatch = Boolean(pt.track?.spotifyTrackId);
      if (!hasMatch) return true;
      if (pt.status === "failed") return true;
      if (pt.status === "pending" && pt.track?.matchSource === "manual") {
        return true;
      }
      return false;
    });

    const newPlaylistStatus =
      allPlaylistTracks.length > 0 && !hasUnresolvedTracks
        ? "completed"
        : "partial";

    if (newPlaylistStatus !== playlistWithTracks.syncStatus) {
      await this.playlistRepository.updateSyncStatus(playlistId, {
        status: newPlaylistStatus,
        lastSyncedAt: playlistWithTracks.lastSyncedAt || new Date(),
      });
    }

    this.logger.info(
      {
        playlistId,
        trackId,
        spotifyTrackId,
        syncNow,
        syncedToSpotify,
      },
      "Manual track match saved"
    );

    return {
      playlistId,
      playlistStatus: newPlaylistStatus,
      playlistTrackId: playlistTrack.id,
      playlistTrackStatus: finalTrackStatus,
      syncedToSpotify,
      track: {
        id: updatedTrack.id,
        youtube_video_id: updatedTrack.youtubeVideoId,
        youtube_title: updatedTrack.youtubeTitle,
        youtube_channel: updatedTrack.youtubeChannel ?? null,
        spotify_track_id: updatedTrack.spotifyTrackId ?? null,
        spotify_uri: updatedTrack.spotifyUri ?? null,
        spotify_artist: updatedTrack.spotifyArtist ?? null,
        spotify_album: updatedTrack.spotifyAlbum ?? null,
        match_score: updatedTrack.matchScore,
        matched_at: updatedTrack.matchedAt
          ? updatedTrack.matchedAt.toISOString()
          : null,
        match_source: updatedTrack.matchSource ?? null,
      },
    };
  }
}

