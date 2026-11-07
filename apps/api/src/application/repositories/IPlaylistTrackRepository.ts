import { PlaylistTrack } from '../../domain/entities/PlaylistTrack';

export interface IPlaylistTrackRepository {
  findByPlaylistId(playlistId: string): Promise<PlaylistTrack[]>;

  findByPlaylistAndTrackId?(playlistId: string, trackId: string): Promise<PlaylistTrack | null>;

  create(input: {
    playlistId: string;
    trackId: string;
    position?: number;
    status?: 'pending' | 'synced' | 'failed';
  }): Promise<PlaylistTrack>;

  updateStatus(id: string, status: 'pending' | 'synced' | 'failed'): Promise<PlaylistTrack>;

  existsInPlaylist(playlistId: string, trackId: string): Promise<boolean>;
}