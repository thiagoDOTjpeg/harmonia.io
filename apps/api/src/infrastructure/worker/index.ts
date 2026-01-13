import { Container } from "@/main/container";
import { SyncPlaylistJobData } from "@/types/sync-job";
import { Worker } from "bullmq";
import { RequestContext } from "../context";
import { RedisInstance } from "../db/redis/client";
import { logger } from "../logger";

export function startWorker() {
  const worker = new Worker<SyncPlaylistJobData>("sync-playlist", async (job) => {
    return await RequestContext.run(
      { requestId: job.id?.toString() || "unknown", correlationId: job.id?.toString(), userId: job.data.userId },
      async () => {
        return Container.getSyncYoutubePlaylistToSpotifyUseCase().execute(job.data);
      }
    )
  }, { connection: RedisInstance.getInstance().getRedis() })

  logger.info("Sync Worker started")

  process.on('SIGTERM', async () => {
    logger.info('Waiting for jobs to finish...');
    await worker.close();
    process.exit(0);
  });
  process.on('SIGINT', async () => {
    logger.info('Waiting for jobs to finish...');
    await worker.close();
    process.exit(0);
  });
}
