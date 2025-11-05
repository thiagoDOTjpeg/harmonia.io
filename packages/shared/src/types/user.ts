export interface UserDashboard {
  user_id: string;
  email: string;
  is_spotify_connected: boolean;
  is_youtube_connected: boolean;
  total_playlists: number;
  total_songs: number;
  synced_songs: number;
  las_sync_at: Date | null;
}