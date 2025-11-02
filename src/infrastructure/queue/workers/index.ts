import { PlaylistSyncQueue } from '../PlaylistSyncQueue';
import { PlaylistSyncWorker } from './PlaylistSyncWorker';

export function startWorkers() {
  const queue = new PlaylistSyncQueue();

  queue.getQueue().process('sync-playlist', 5, async (job) => {
    return await PlaylistSyncWorker.process(job);
  });

  console.log('✅ Workers iniciados');

  process.on('SIGTERM', async () => {
    console.log('⏳ Aguardando jobs finalizarem...');
    await queue.close();
    process.exit(0);
  });

  return queue;
}