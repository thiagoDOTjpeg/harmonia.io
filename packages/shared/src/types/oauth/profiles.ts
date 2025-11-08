export type OAuthUserProfile = {
  email?: string;
  name?: string | null;
};

export type GoogleOAuthProfile = OAuthUserProfile & {
  sub: string;
  email_verified?: boolean;
};

export type SpotifyOAuthProfile = OAuthUserProfile & {
  id: string;
  display_name?: string | null;
};