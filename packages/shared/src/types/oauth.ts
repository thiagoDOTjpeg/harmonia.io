export type OAuthMode = 'login' | 'register';

export interface OAuthState {
  mode: OAuthMode;
  returnTo?: string;
}

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'invalid_state_or_code'
  | 'token_exchange_failed'
  | 'userinfo_failed'
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



