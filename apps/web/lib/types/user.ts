export interface UserDashboardData {
  user_id: string;
  email: string;
  is_spotify_connected: boolean;
  is_youtube_connected: boolean;
  total_playlists: number;
  total_songs: number;
  synced_songs: number;
  last_sync_at: string | null;
}

export type UserDashboardResponse = UserDashboardData;