import { GoogleOAuthProfile, SpotifyOAuthProfile } from './profiles';
import { OAuthTokens } from './tokens';

export type OAuthProviderResult = GoogleOAuthResult | SpotifyOAuthResult;

export type GoogleOAuthResult = {
  tokens: OAuthTokens;
  profile: GoogleOAuthProfile;
  youtubeChannelId?: string | null;
};

export type SpotifyOAuthResult = {
  tokens: OAuthTokens;
  profile: SpotifyOAuthProfile;
};