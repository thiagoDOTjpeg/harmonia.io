import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { cancelSyncPlaylistDto, createSyncPlaylistDto, getSyncPlaylistStatusDto, retrySyncPlaylistDto } from "@/infrastructure/http/schemas/playlist-sync.schema";
import { PlaylistSyncQueue } from "@/infrastructure/queue/PlaylistSyncQueue";
import { ServiceProvider } from "@harmonia/shared";
import { ServiceConnection } from "../entities/ServiceConnection";
import { User } from "../entities/User";

export class SyncMusicService {
  constructor(
    private readonly serviceConnectionRepository: IServiceConnectionRepository,
    private readonly playlistRepository: IPlaylistRepository,
    private readonly syncQueue: PlaylistSyncQueue
  ) { }

  public async syncPlaylist(user: User, bodyParsed: createSyncPlaylistDto) {
    const { youtubePlaylistId, priority } = bodyParsed;
    const serviceConnetions: Map<ServiceProvider, ServiceConnection> = new Map();

    const existingConnections = await this.serviceConnectionRepository.findAllByUserId(user.id);
    if (existingConnections == null) {
      return {
        sucess: false,
        error: "service_connection_not_found",
        message: "Conexão com serviços necessário não estão ativas"
      }
    }

    for (const sc of existingConnections) {
      serviceConnetions.set(sc.provider, sc)
    }

    const spotifyServiceConnection = serviceConnetions.get(ServiceProvider.SPOTIFY)
    const googleServiceConnection = serviceConnetions.get(ServiceProvider.GOOGLE)

    if (spotifyServiceConnection === undefined || googleServiceConnection === undefined) {
      return {
        success: false,
        error: "service_connection_not_found",
        message: "Conexão com serviços necessário não estão ativas"
      }
    }

    const playlist = await this.playlistRepository.findByYoutubePlaylistId(
      user.id,
      youtubePlaylistId
    );

    const job = await this.syncQueue.addSyncJob({
      playlistId: playlist?.id || `temp-${Date.now()}`,
      userId: user.id,
      youtubePlaylistId,
      googleAccessToken: spotifyServiceConnection.accessToken,
      spotifyAccessToken: googleServiceConnection.accessToken,
      spotifyUserId: spotifyServiceConnection.providerAccountId,
      priority: priority || 10,
    });


    console.log(`[API] Job ${job.id} adicionado para sincronização`);

    return {
      success: true,
      data: {
        jobId: job.id,
        playlistId: playlist?.id,
        status: 'pending',
        message: 'Sincronização iniciada. Use /sync/status/:jobId para acompanhar',
      },
    };
  }

  public async getSyncStatus(queryParsed: getSyncPlaylistStatusDto) {
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

  public async cancelSync(queryParsed: cancelSyncPlaylistDto) {
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

  public async retrySync(queryParsed: retrySyncPlaylistDto) {
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
}