export type OAuthMode = 'login' | 'register';

export interface OAuthState {
  mode: OAuthMode;
  returnTo?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  external_urls: { spotify: string };
  images: Array<{ url: string }>;
  tracks: { total: number };
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string };
  duration_ms: number;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    resourceId: { videoId: string };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

// Respostas de token
export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
  scope: string;
  token_type: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

// Perfis
export interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface SpotifyMe {
  id: string;
  email?: string | null;
  display_name?: string | null;
}

// Respostas da API
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'invalid_state_or_code'
  | 'token_exchange_failed'
  | 'userinfo_failed'
  | 'me_fetch_failed'
  | 'email_in_use'
  | 'email_ambiguous'
  | 'no_account'
  | 'require_manual_link'
  | 'conflict'
  | 'auth_failed';

export interface AuthError {
  error: AuthErrorCode;
  message?: string;
  details?: string;
}

export interface AuthSuccessUser {
  id: string;
  email: string | null;
  name: string | null;
  googleId?: string | null;
  spotifyId?: string | null;
  youtubeChannelId?: string | null;
}

export interface AuthSuccess {
  token: string;
  user: AuthSuccessUser;
  returnTo?: string;
}

export type AuthResponse = AuthSuccess | AuthError;