import { GoogleOAuthResult, YouTubePlaylistInfo, YouTubeVideo } from '@harmonia/shared';


export interface IGoogleOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<GoogleOAuthResult>;
  getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo>;
  getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]>;
}