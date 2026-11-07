import { DeletePlaylistUseCase } from "@/application/use_cases/playlist/DeletePlaylistUseCase";
import { GetPlaylistDetailsUseCase } from "@/application/use_cases/playlist/GetPlaylistDetailsUseCase";
import { GetTrackCandidatesUseCase } from "@/application/use_cases/playlist/GetTrackCandidatesUseCase";
import { ManualMatchTrackUseCase } from "@/application/use_cases/playlist/ManualMatchTrackUseCase";
import { SpotifyMusicClient } from "@/infrastructure/client/SpotifyMusicClient";
import { PinoLoggerAdapter } from "@/infrastructure/logger";
import {
  makePrismaIPlaylistRepository,
  makePrismaIPlaylistTrackRepository,
  makePrismaITrackRepository,
} from "./repositories.factory";

const spotifyMusicClient = new SpotifyMusicClient();
const logger = new PinoLoggerAdapter();

export const makeGetPlaylistDetailsUseCase = () => {
  return new GetPlaylistDetailsUseCase(makePrismaIPlaylistRepository());
};

export const makeDeletePlaylistUseCase = () => {
  return new DeletePlaylistUseCase(makePrismaIPlaylistRepository());
};

export const makeGetTrackCandidatesUseCase = () => {
  return new GetTrackCandidatesUseCase(
    makePrismaIPlaylistRepository(),
    makePrismaITrackRepository(),
    spotifyMusicClient
  );
};

export const makeManualMatchTrackUseCase = () => {
  return new ManualMatchTrackUseCase(
    makePrismaIPlaylistRepository(),
    makePrismaITrackRepository(),
    makePrismaIPlaylistTrackRepository(),
    spotifyMusicClient,
    logger
  );
};

