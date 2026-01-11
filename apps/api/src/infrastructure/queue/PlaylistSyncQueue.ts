import { logger } from '@/infrastructure/logger';
import { SyncPlaylistJobData } from '@/types/sync-job';
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

    logger.info({ host: redisConfig.host, port: redisConfig.port }, 'Connecting to Redis queue');

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
      logger.info({ jobId: job.id, result }, 'Job completed');
    });

    this.queue.on('failed', (job, err) => {
      logger.error({ err, jobId: job.id }, 'Job failed');
    });

    this.queue.on('progress', (job, progress) => {
      logger.debug({ jobId: job.id, progress }, 'Job progress');
    });

    this.queue.on('stalled', (job) => {
      logger.warn({ jobId: job.id }, 'Job stalled (worker may have died)');
    });

    this.queue.on('error', (error) => {
      logger.error({ err: error }, 'Queue error');
    });

    this.queue.on('waiting', (jobId) => {
      logger.debug({ jobId }, 'Job waiting');
    });

    this.queue.on('active', (job) => {
      logger.info({ jobId: job.id }, 'Job started');
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
      logger.info({ jobId: duplicate.id, userId: data.userId }, 'Duplicate job found');
      return duplicate;
    }

    const job = await this.queue.add("sync-playlist", data, {
      priority: data.priority || 10,
      jobId: `sync-${data.userId}-${data.youtubePlaylistId}-${Date.now()}`,
    });

    logger.info({ jobId: job.id, userId: data.userId, playlistId: data.youtubePlaylistId }, 'Job added to queue');
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
      logger.info({ jobId }, 'Job cancelled');
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
      logger.info({ jobId }, 'Job retried');
      return true;
    }

    return false;
  }

  async cleanOldJobs() {
    await this.queue.clean(7 * 24 * 3600 * 1000, 'completed');
    await this.queue.clean(14 * 24 * 3600 * 1000, 'failed');
    logger.info('Old jobs cleaned');
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    logger.info('Queue paused');
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    logger.info('Queue resumed');
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
    logger.info('Queue connection closed');
  }
}