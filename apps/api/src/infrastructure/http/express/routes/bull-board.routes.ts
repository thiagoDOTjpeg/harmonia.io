import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';
import { PlaylistSyncQueue } from '../../../queue/PlaylistSyncQueue';

const router = Router();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const syncQueue = new PlaylistSyncQueue();

createBullBoard({
  queues: [new BullAdapter(syncQueue.getQueue())],
  serverAdapter: serverAdapter,
});

router.use('/admin/queues', serverAdapter.getRouter());

export default router;