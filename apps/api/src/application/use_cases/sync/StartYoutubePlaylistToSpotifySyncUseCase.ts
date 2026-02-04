import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ILogger } from "@/infrastructure/logger";
import { PlaylistSyncQueue } from "@/infrastructure/queue/PlaylistSyncQueue";
import { ERRORS } from "@/types/constant/errors";
import { createSyncPlaylistDTO, PlaylistLimitExceededError, ServiceProvider } from "@harmonia/shared";

export type StartYoutubePlaylistToSpotifySyncPayload = {
  connections: Map<ServiceProvider, ServiceConnection>
  userId: string,
} & createSyncPlaylistDTO

export class StartYoutubePlaylistToSpotifySyncUseCase {
  private readonly MAX_ALLOWED_TRACKS = Number(process.env.PLAYLIST_MAX_SONGS)

  constructor(
    private readonly syncQueue: PlaylistSyncQueue,
    private readonly playlistRepository: IPlaylistRepository,
    private readonly googleMusicClient: IGoogleMusicClient,
    private readonly logger: ILogger,
  ) { }

  async execute(payload: StartYoutubePlaylistToSpotifySyncPayload) {
    const { youtubePlaylistId, priority, userId } = payload;
    const googleConnection = payload.connections.get(ServiceProvider.GOOGLE)
    const spotifyConnection = payload.connections.get(ServiceProvider.SPOTIFY)

    if (spotifyConnection === undefined || googleConnection === undefined) {
      throw new Error(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE);
    }

    const youtubePlaylistInfo = await this.googleMusicClient.getPlaylistInfo(
      youtubePlaylistId,
      googleConnection.accessToken
    );


    if (this.MAX_ALLOWED_TRACKS && youtubePlaylistInfo.itemCount > this.MAX_ALLOWED_TRACKS) {
      throw new PlaylistLimitExceededError(`O limite para o MVP é de ${this.MAX_ALLOWED_TRACKS} músicas. Essa playlist tem ${youtubePlaylistInfo.itemCount}.`);
    }

    const playlist = await this.playlistRepository.findByYoutubePlaylistId(
      userId,
      youtubePlaylistId
    );

    const job = await this.syncQueue.addSyncJob({
      playlistId: playlist?.id || `temp-${Date.now()}`,
      userId: userId,
      youtubePlaylistId,
      googleAccessToken: googleConnection.accessToken,
      spotifyAccessToken: spotifyConnection.accessToken,
      spotifyUserId: spotifyConnection.providerAccountId,
      priority: priority || 10,
    });


    this.logger.info({ jobId: job.id, userId: userId, playlistId: youtubePlaylistId }, 'Sync job added');

    return {
      jobId: job.id,
      playlistId: playlist?.id,
      status: 'pending',
      message: 'Sincronização iniciada. Use /sync/status/:jobId para acompanhar',
    };
  }
}