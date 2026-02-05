import { StartYoutubePlaylistToSpotifySyncUseCase } from "@/application/use_cases/sync/StartYoutubePlaylistToSpotifySyncUseCase";
import { GoogleMusicClient } from "@/infrastructure/client/GoogleMusicClient";
import { prisma } from "@/infrastructure/db/prisma/client";
import { PrismaPlaylistRepository } from "@/infrastructure/db/prisma/repositories/PrismaPlaylistRepository";
import { PinoLoggerAdapter } from "@/infrastructure/logger";
import { PlaylistSyncQueue } from "@/infrastructure/queue/PlaylistSyncQueue";

const makePlaylistSyncQueue = () => {
  return new PlaylistSyncQueue();
}

const makeIPlaylistRepository = () => {
  return new PrismaPlaylistRepository(prisma);
}

const makeIGoogleMusicClient = () => {
  return new GoogleMusicClient();
}

const makeILogger = () => {
  return new PinoLoggerAdapter();
}

export const makeStartYoutubePlaylistToSpotifySyncUseCase = () => {
  return new StartYoutubePlaylistToSpotifySyncUseCase(
    makePlaylistSyncQueue(),
    makeIPlaylistRepository(),
    makeIGoogleMusicClient(),
    makeILogger()
  );
}