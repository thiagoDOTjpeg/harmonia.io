import { logger } from '@/infrastructure/logger';
import { PlaylistSyncQueue } from '../PlaylistSyncQueue';
import { PlaylistSyncWorker } from './PlaylistSyncWorker';

export function startWorkers() {
  const queue = new PlaylistSyncQueue();

  queue.getQueue().process('sync-playlist', 5, async (job) => {
    return await PlaylistSyncWorker.process(job);
  });

  logger.info('Workers started');

  process.on('SIGTERM', async () => {
    logger.info('Waiting for jobs to finish...');
    await queue.close();
    process.exit(0);
  });

  return queue;
}