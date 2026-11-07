import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { ITrackRepository } from "@/application/repositories/ITrackRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { MusicMatchingService } from "@/domain/services/MusicMatchingService";
import { ERRORS } from "@/types/constant/errors";
import {
  NotFoundError,
  ServiceProvider,
  TrackCandidatesResponseDTO,
} from "@harmonia/shared";

export interface GetTrackCandidatesPayload {
  playlistId: string;
  trackId: string;
  userId: string;
  connections: Map<ServiceProvider, ServiceConnection>;
  query?: string;
}

export class GetTrackCandidatesUseCase {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly spotifyMusicClient: ISpotifyMusicClient
  ) {}

  async execute(
    payload: GetTrackCandidatesPayload
  ): Promise<TrackCandidatesResponseDTO> {
    const { playlistId, trackId, userId, connections, query } = payload;

    const playlist = this.playlistRepository.findById
      ? await this.playlistRepository.findById(playlistId)
      : await this.playlistRepository.findByIdWithTracks?.(playlistId);

    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundError("Playlist não encontrada");
    }

    const track = await this.trackRepository.findById?.(trackId);
    if (!track) {
      throw new NotFoundError("Música não encontrada");
    }

    const spotifyConnection = connections.get(ServiceProvider.SPOTIFY);
    if (!spotifyConnection) {
      throw new Error(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE);
    }

    const generated = MusicMatchingService.generateSpotifyQuery(
      track.youtubeTitle,
      track.youtubeChannel || ""
    );

    const candidates = this.spotifyMusicClient.searchCandidates
      ? await this.spotifyMusicClient.searchCandidates(
          {
            query,
            youtubeTitle: track.youtubeTitle,
            channelTitle: track.youtubeChannel || "",
            limit: 8,
          },
          spotifyConnection.accessToken
        )
      : [];

    return {
      trackId: track.id,
      youtubeTitle: track.youtubeTitle,
      youtubeChannel: track.youtubeChannel,
      generatedQuery: query?.trim() || generated.query,
      candidates,
    };
  }
}

