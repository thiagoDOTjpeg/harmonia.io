import { GoogleExchangeResult } from "../../../shared/types/oauth/google";

export interface IGoogleOAuthClient {
  buildAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<GoogleExchangeResult>;
}