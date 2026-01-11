export type OAuthUserProfile = {
  email: string;
  name: string;
};

export type GoogleOAuthProfile = OAuthUserProfile & {
  sub: string;
  email_verified?: boolean;
};

export type SpotifyOAuthProfile = Omit<OAuthUserProfile, "name"> & {
  id: string;
  display_name: string;
};