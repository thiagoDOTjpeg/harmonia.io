import { SpotifyExchangeResult } from "../../../shared/types/spotify";

export interface ISpotifyOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<SpotifyExchangeResult>;
}