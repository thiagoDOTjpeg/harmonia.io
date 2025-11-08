import { SpotifyOAuthResult } from '@harmonia/shared';

export interface ISpotifyOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<SpotifyOAuthResult>;
}