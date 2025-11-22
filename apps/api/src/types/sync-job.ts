export interface SyncPlaylistJobData {
  playlistId: string;
  userId: string;
  youtubePlaylistId: string;
  googleAccessToken: string;
  spotifyAccessToken: string;
  spotifyUserId: string;
  priority?: number;
}

export interface SyncProgress {
  status: 'pending' | 'fetching' | 'matching' | 'adding' | 'completed' | 'failed';
  currentTrack: number;
  totalTracks: number;
  syncedTracks: number;
  failedTracks: number;
  currentTrackTitle?: string;
  error?: string;
}

export interface SyncResult {
  playlistId: string;
  totalTracks: number;
  syncedTracks: number;
  failedTracks: number;
  duplicates: number;
  newTracks: number;
  status: 'completed' | 'partial' | 'failed';
  duration: number; // em ms
}