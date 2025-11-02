import { SyncedPlaylist } from "../../domain/entities/SyncedPlaylist";

export interface IPlaylistRepository {
  findByYoutubePlaylistId(userId: string, youtubePlaylistId: string): Promise<SyncedPlaylist | null>;

  findByUserId(userId: string): Promise<SyncedPlaylist[]>;

  create(input: {
    userId: string;
    youtubePlaylistId: string;
    youtubeUrl: string;
    youtubeTitle: string | null;
    spotifyPlaylistId: string;
    spotifyUrl: string;
    spotifyTitle: string | null;
  }): Promise<SyncedPlaylist>;

  updateSyncStatus(id: string, input: {
    status: string;
    lastSyncedAt: Date;
  }): Promise<SyncedPlaylist>;

  delete(id: string): Promise<void>;
}