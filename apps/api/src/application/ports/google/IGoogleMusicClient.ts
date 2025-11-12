import { YouTubePlaylistInfo, YouTubeVideo } from "@harmonia/shared";

export interface IGoogleMusicClient {
  getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo>;
  getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]>;

}