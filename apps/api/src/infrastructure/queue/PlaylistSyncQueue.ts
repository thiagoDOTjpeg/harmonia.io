import { SyncPlaylistJobData } from '@harmonia/shared';
import Bull, { Job, Queue } from 'bull';

export class PlaylistSyncQueue {
  private queue: Queue<SyncPlaylistJobData>;

  constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    console.log(`🔍 [Queue] Conectando ao Redis: ${redisConfig.host}:${redisConfig.port}`);

    this.queue = new Bull<SyncPlaylistJobData>('sync-playlist', {
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
    this.queue.on('completed', (job, result) => {
      console.log(`[Queue] Job ${job.id} concluído:`, result);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`[Queue] Job ${job.id} falhou:`, err.message);
    });

    this.queue.on('progress', (job, progress) => {
      console.log(`[Queue] Job ${job.id} progresso:`, progress);
    });

    this.queue.on('stalled', (job) => {
      console.warn(`[Queue] Job ${job.id} travado (provavelmente worker morreu)`);
    });

    this.queue.on('error', (error) => {
      console.error('[Queue] Erro na fila:', error.message);
    });

    this.queue.on('waiting', (jobId) => {
      console.log(`[Queue] Job ${jobId} aguardando processamento`);
    });

    this.queue.on('active', (job) => {
      console.log(`[Queue] Job ${job.id} iniciado`);
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

    const job = await this.queue.add("sync-playlist", data, {
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
    const counts = await this.queue.getJobCounts();

    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    };
  }

  async getUserJobs(userId: string, states: ('waiting' | 'active' | 'completed' | 'failed' | 'delayed')[] = ['waiting', 'active', 'completed', 'failed']) {
    const jobs = await this.queue.getJobs(states);

    return Promise.all(
      jobs
        .filter((job) => job.data.userId === userId)
        .map(async (job) => ({
          id: job.id,
          state: await job.getState(),
          progress: job.progress(),
          data: job.data,
          finishedOn: job.finishedOn,
          processedOn: job.processedOn,
          failedReason: job.failedReason,
          returnvalue: job.returnvalue,
        }))
    );
  }

  getQueue(): Queue<SyncPlaylistJobData> {
    return this.queue;
  }

  async close(): Promise<void> {
    await this.queue.close();
    console.log('[Queue] Conexão fechada');
  }
}