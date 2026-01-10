import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { EnsureValidConnectionsUseCase } from "@/application/use_cases/service-connection/EnsureValidConnectionsUseCase";
import { PrismaPlaylistRepository } from "@/infrastructure/db/prisma/repositories/PrismaPlaylistRepository";
import { PlaylistSyncQueue } from "@/infrastructure/queue/PlaylistSyncQueue";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { cancelSyncPlaylistDTO, createSyncPlaylistDTO, getSyncPlaylistStatusDTO, PlaylistLimitExceededError, retrySyncPlaylistDTO, ServiceProvider } from "@harmonia/shared";
import { ServiceConnection } from "../../domain/entities/ServiceConnection";
import { User } from "../../domain/entities/User";
import { IGoogleMusicClient } from "../ports/google/IGoogleMusicClient";

export class SyncMusicService {
  constructor(
    private readonly syncQueue: PlaylistSyncQueue,
    private readonly playlistRepository: PrismaPlaylistRepository,
    private readonly AESEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly ensureValidConnectionsUseCase: EnsureValidConnectionsUseCase,
    private readonly googleMusicClient: IGoogleMusicClient
  ) { }

  public async syncPlaylist(user: User, bodyParsed: createSyncPlaylistDTO) {
    const { youtubePlaylistId, priority } = bodyParsed;
    let connections: Map<ServiceProvider, ServiceConnection>;

    try {
      connections = await this.ensureValidConnectionsUseCase.execute(user.id);
    } catch (error) {
      throw new Error(ERRORS.SYNC_PLAYLIST, { cause: error })
    }

    const googleConnection = connections.get(ServiceProvider.GOOGLE)
    const spotifyConnection = connections.get(ServiceProvider.SPOTIFY)

    if (spotifyConnection === undefined || googleConnection === undefined) {
      throw new Error(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE);
    }

    const youtubePlaylistInfo = await this.googleMusicClient.getPlaylistInfo(
      youtubePlaylistId,
      this.getServiceConnectionAccessToken(googleConnection)
    );

    const MAX_ALLOWED_TRACKS = Number(process.env.PLAYLIST_MAX_SONGS);

    if (MAX_ALLOWED_TRACKS && youtubePlaylistInfo.itemCount > MAX_ALLOWED_TRACKS) {
      throw new PlaylistLimitExceededError(`O limite para o MVP é de ${MAX_ALLOWED_TRACKS} músicas. Essa playlist tem ${youtubePlaylistInfo.itemCount}.`);
    }

    const playlist = await this.playlistRepository.findByYoutubePlaylistId(
      user.id,
      youtubePlaylistId
    );

    const job = await this.syncQueue.addSyncJob({
      playlistId: playlist?.id || `temp-${Date.now()}`,
      userId: user.id,
      youtubePlaylistId,
      googleAccessToken: this.getServiceConnectionAccessToken(googleConnection),
      spotifyAccessToken: this.getServiceConnectionAccessToken(spotifyConnection),
      spotifyUserId: spotifyConnection.providerAccountId,
      priority: priority || 10,
    });


    console.log(`[API] Job ${job.id} adicionado para sincronização`);

    return {
      jobId: job.id,
      playlistId: playlist?.id,
      status: 'pending',
      message: 'Sincronização iniciada. Use /sync/status/:jobId para acompanhar',
    };
  }

  public async getSyncStatus(queryParsed: getSyncPlaylistStatusDTO) {
    const { jobId } = queryParsed;
    const job = await this.syncQueue.getQueue().getJob(jobId);

    if (!job) {
      return {
        success: false,
        error: "job_not_found",
        message: "Job não encontrado",
      }
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      success: true,
      data: {
        jobId: job.id,
        state,
        progress,
        finishedOn: job.finishedOn,
        processedOn: job.processedOn,
        returnvalue: job.returnvalue,
      },
    };
  }

  public async cancelSync(queryParsed: cancelSyncPlaylistDTO) {
    const cancelled = await this.syncQueue.cancelSync(queryParsed.jobId)
    if (!cancelled) {
      return {
        error: 'job_not_found',
        message: 'Job não encontrado ou já finalizado',
      };
    }
    return {
      success: true,
      message: "Sincronização cancelada"
    }
  }

  public async retrySync(queryParsed: retrySyncPlaylistDTO) {
    const cancelled = await this.syncQueue.cancelSync(queryParsed.jobId)
    if (!cancelled) {
      return {
        error: 'job_not_found',
        message: 'Job não encontrado ou já finalizado',
      };
    }
    return {
      success: true,
      message: "Sincronização reiniciada"
    }
  }
  public async getQueueStatus() {
    const stats = this.syncQueue.getStats();
    return {
      success: true,
      data: stats,
    }
  }

  private getServiceConnectionAccessToken(serviceConnection: ServiceConnection): string {
    const encryptedToken = serviceConnection.accessToken
    const { cipherText, iv, tag } = this.tokenSerializer.deserialize(encryptedToken)
    const descriptedToken = this.AESEncrypter.decrypt(iv, cipherText, tag);
    return descriptedToken;
  }

}