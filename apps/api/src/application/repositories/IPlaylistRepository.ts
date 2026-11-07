import { SyncedPlaylist } from "../../domain/entities/SyncedPlaylist";

export interface IPlaylistRepository {
  findById?(id: string): Promise<SyncedPlaylist | null>;

  findByIdWithTracks?(playlistId: string): Promise<any | null>;

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