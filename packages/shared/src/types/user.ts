export interface RecentSync {
  id: string;
  name: string;
  source_platform: string;
  target_platform: string;
  songs_count: number;
  last_synced_at: string;
  status: string;
}

export interface UserSummary {
  user_id: string;
  email: string;
  name: string | null;
  user_created_at: string;
  is_spotify_connected: boolean;
  is_youtube_connected: boolean;
  total_playlists: number;
  synced_playlists: number;
  total_songs: number;
  synced_songs: number;
  synced_songs_last_7_days: number;
  last_sync_at: string | null;
  recent_syncs: RecentSync[];
}
