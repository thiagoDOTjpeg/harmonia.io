import Bull, { Job, Queue } from 'bull';
import { SyncPlaylistJobData, SyncResult } from './jobs/SyncPlaylistJob';

export class PlaylistSyncQueue {
  private queue: Queue<SyncPlaylistJobData>;

  constructor() {
    // Conectar ao Redis
    this.queue = new Bull<SyncPlaylistJobData>('playlist-sync', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: 3, // Tentar 3 vezes antes de falhar
        backoff: {
          type: 'exponential',
          delay: 5000, // 5s, 10s, 20s
        },
        removeOnComplete: {
          count: 100, // Manter últimos 100 jobs completados
          age: 7 * 24 * 3600, // Manter por 7 dias
        },
        removeOnFail: {
          count: 50, // Manter últimos 50 jobs falhados
          age: 14 * 24 * 3600, // Manter por 14 dias
        },
      },
    });

    // Eventos da fila
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

  /**
   * Adicionar job de sincronização na fila
   */
  async addSyncJob(data: SyncPlaylistJobData): Promise<Job<SyncPlaylistJobData>> {
    // Verificar se já existe job pendente para esta playlist
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

    // Adicionar novo job
    const job = await this.queue.add('sync-playlist', data, {
      priority: data.priority || 10,
      jobId: `sync-${data.userId}-${data.youtubePlaylistId}-${Date.now()}`,
    });

    console.log(`[Queue] Job ${job.id} adicionado à fila`);
    return job;
  }

  /**
   * Buscar job por ID
   */
  async getJob(jobId: string): Promise<Job<SyncPlaylistJobData> | null> {
    return await this.queue.getJob(jobId);
  }

  /**
   * Cancelar job
   */
  async cancelSync(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);

    if (!job) {
      return false;
    }

    const state = await job.getState();

    // Só pode cancelar se estiver aguardando ou ativo
    if (['waiting', 'active', 'delayed'].includes(state)) {
      await job.remove();
      console.log(`[Queue] Job ${jobId} cancelado`);
      return true;
    }

    return false;
  }

  /**
   * Reiniciar job falhado
   */
  async retrySync(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);

    if (!job) {
      return false;
    }

    const state = await job.getState();

    // Só pode reiniciar se falhou
    if (state === 'failed') {
      await job.retry();
      console.log(`[Queue] Job ${jobId} reiniciado`);
      return true;
    }

    return false;
  }

  /**
   * Limpar jobs antigos
   */
  async cleanOldJobs() {
    // Limpar completados com mais de 7 dias
    await this.queue.clean(7 * 24 * 3600 * 1000, 'completed');

    // Limpar falhados com mais de 14 dias
    await this.queue.clean(14 * 24 * 3600 * 1000, 'failed');

    console.log('[Queue] Jobs antigos limpos');
  }

  /**
   * Pausar fila
   */
  async pause(): Promise<void> {
    await this.queue.pause();
    console.log('[Queue] Fila pausada');
  }

  /**
   * Resumir fila
   */
  async resume(): Promise<void> {
    await this.queue.resume();
    console.log('[Queue] Fila retomada');
  }

  /**
   * Estatísticas da fila
   */
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

  /**
   * Listar jobs do usuário
   */
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

  /**
   * Obter referência da fila (para workers e Bull Board)
   */
  getQueue(): Queue<SyncPlaylistJobData> {
    return this.queue;
  }

  /**
   * Fechar conexão
   */
  async close(): Promise<void> {
    await this.queue.close();
    console.log('[Queue] Conexão fechada');
  }
}