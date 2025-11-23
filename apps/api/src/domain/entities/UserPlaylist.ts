export class UserPlaylist {
  constructor(
    public id: string,
    public user_id: string,
    public youtube_playlist_id: string,
    public youtube_title: string | null,
    public spotify_playlist_id: string,
    public spotify_title: string | null,
    public sync_status: string,
    public last_synced_at: string | null,
    public songs: number,
    public created_at: string,
    public updated_at: string
  ) {
  }
}