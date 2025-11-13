export class UserPlaylist {
  constructor(
    private id: string,
    private user_id: string,
    private youtube_playlist_id: string,
    private youtube_title: string | null,
    private spotify_playlist_id: string,
    private spotify_title: string | null,
    private sync_status: string,
    private last_synced_at: string | null,
    private songs: number,
    private created_at: string,
    private updated_at: string
  ) {
  }
}