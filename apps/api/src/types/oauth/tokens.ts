export type OAuthTokens = {
  access_token: string;
  refresh_token?: string | null;
  expires_in: number;
};

export interface OAuthProviderToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}