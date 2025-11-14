import { SyncPlaylistJobData, SyncResult } from '@harmonia/shared';
import Bull, { Job, Queue } from 'bull';

export class PlaylistSyncQueue {
  private queue: Queue<SyncPlaylistJobData>;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production' ||
      !!process.env.UPSTASH_REDIS_REST_URL;

    let redisConfig: any;

    if (isProduction) {
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL;

      if (!redisUrl) {
        throw new Error('❌ UPSTASH_REDIS_REST_URL deve estar definida em produção');
      }

      const upstashUrl = process.env.REDIS_URL || redisUrl.replace('https://', 'rediss://');

      redisConfig = upstashUrl;
      console.log('🔍 [Queue] Usando Upstash Redis em produção');
    } else {
      redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      };
      console.log('🔍 [Queue] Usando Redis local em desenvolvimento');
    }

    this.queue = new Bull<SyncPlaylistJobData>('playlist-sync', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          count: 100,
          age: 7 * 24 * 3600,
        },
        removeOnFail: {
          count: 50,
          age: 14 * 24 * 3600,
        },
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.queue.on('completed', (job: Job<SyncPlaylistJobData>, result: SyncResult) => {
      console.log(`[Queue] Job ${job.id} concluído:`, result);
    });

    this.queue.on('failed', (job: Job<SyncPlaylistJobData>, error: Error) => {
      console.error(`[Queue] Job ${job.id} falhou:`, error.message);
    });

    this.queue.on('progress', (job: Job<SyncPlaylistJobData>, progress: any) => {
      console.log(`[Queue] Job ${job.id} progresso:`, progress);
    });

    this.queue.on('stalled', (job: Job<SyncPlaylistJobData>) => {
      console.warn(`[Queue] Job ${job.id} travado (provavelmente worker morreu)`);
    });

    this.queue.on('error', (error: Error) => {
      console.error('[Queue] Erro na fila:', error);
    });
  }

  async addSyncJob(data: SyncPlaylistJobData): Promise<Job<SyncPlaylistJobData>> {
    const existingJobs = await this.queue.getJobs(['waiting', 'active', 'delayed']);
    const duplicate = existingJobs.find(
      (job) =>
        job.data.userId === data.userId &&
        job.data.youtubePlaylistId === data.youtubePlaylistId
    );

    if (duplicate) {
      console.log(`[Queue] Job duplicado encontrado: ${duplicate.id}`);
      return duplicate;
    }

    const job = await this.queue.add('sync-playlist', data, {
      priority: data.priority || 10,
      jobId: `sync-${data.userId}-${data.youtubePlaylistId}-${Date.now()}`,
    });

    console.log(`[Queue] Job ${job.id} adicionado à fila`);
    return job;
  }

  async getJob(jobId: string): Promise<Job<SyncPlaylistJobData> | null> {
    return await this.queue.getJob(jobId);
  }

  async cancelSync(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);

    if (!job) {
      return false;
    }

    const state = await job.getState();

    if (['waiting', 'active', 'delayed'].includes(state)) {
      await job.remove();
      console.log(`[Queue] Job ${jobId} cancelado`);
      return true;
    }

    return false;
  }

  async retrySync(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);

    if (!job) {
      return false;
    }

    const state = await job.getState();

    if (state === 'failed') {
      await job.retry();
      console.log(`[Queue] Job ${jobId} reiniciado`);
      return true;
    }

    return false;
  }

  async cleanOldJobs() {
    await this.queue.clean(7 * 24 * 3600 * 1000, 'completed');

    await this.queue.clean(14 * 24 * 3600 * 1000, 'failed');

    console.log('[Queue] Jobs antigos limpos');
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    console.log('[Queue] Fila pausada');
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    console.log('[Queue] Fila retomada');
  }

  async getStats() {
    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
      this.queue.getPausedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
      total: waiting + active + completed + failed + delayed + paused,
    };
  }

  async getUserJobs(userId: string, states: Bull.JobStatus[] = ['waiting', 'active', 'completed', 'failed']) {
    const jobs = await this.queue.getJobs(states);

    return jobs
      .filter((job) => job.data.userId === userId)
      .map((job) => ({
        id: job.id,
        state: job.getState(),
        progress: job.progress(),
        data: job.data,
        finishedOn: job.finishedOn,
        processedOn: job.processedOn,
        failedReason: job.failedReason,
        returnvalue: job.returnvalue,
      }));
  }

  getQueue(): Queue<SyncPlaylistJobData> {
    return this.queue;
  }

  async close(): Promise<void> {
    await this.queue.close();
    console.log('[Queue] Conexão fechada');
  }
}