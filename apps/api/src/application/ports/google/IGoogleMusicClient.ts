import { YouTubePlaylistInfo, YouTubeVideo } from "@/types/google";

export interface IGoogleMusicClient {
  getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo>;
  getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]>;

}