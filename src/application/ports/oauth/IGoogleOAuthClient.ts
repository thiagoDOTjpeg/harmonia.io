import { GoogleExchangeResult, YouTubePlaylistInfo, YouTubeVideo } from '../../../shared/types/google';


export interface IGoogleOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<GoogleExchangeResult>;
  getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo>;
  getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]>;
}