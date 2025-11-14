import { RecentSync } from "./RecentSync";

export class UserSummary {
  constructor(
    public user_id: string,
    public email: string,
    public name: string | null,
    public user_created_at: string,
    public is_spotify_connected: boolean,
    public is_youtube_connected: boolean,
    public total_playlists: number,
    public synced_playlists: number,
    public total_songs: number,
    public synced_songs: number,
    public synced_songs_last_7_days: number,
    public last_sync_at: string | null,
    public recent_syncs: RecentSync[] | null,
  ) { }
}