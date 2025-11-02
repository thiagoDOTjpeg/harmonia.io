import { PlaylistTrack } from '../../domain/entities/PlaylistTrack';

export interface IPlaylistTrackRepository {
  findByPlaylistId(playlistId: string): Promise<PlaylistTrack[]>;

  create(input: {
    playlistId: string;
    trackId: string;
    position?: number;
  }): Promise<PlaylistTrack>;

  updateStatus(id: string, status: 'pending' | 'synced' | 'failed'): Promise<PlaylistTrack>;

  existsInPlaylist(playlistId: string, trackId: string): Promise<boolean>;
}