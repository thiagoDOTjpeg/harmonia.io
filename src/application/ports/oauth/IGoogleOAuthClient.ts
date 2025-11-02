import { GoogleExchangeResult } from '../../../shared/types/oauth/google';

export interface YouTubePlaylistInfo {
  id: string;
  title: string;
  description: string;
  itemCount: number;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
}

export interface IGoogleOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<GoogleExchangeResult>;
  getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo>;
  getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]>;
}