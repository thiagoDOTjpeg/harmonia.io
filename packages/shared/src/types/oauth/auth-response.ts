export type AuthErrorCode =
  | 'unauthorized'
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
  success: false;
  error: AuthErrorCode;
  message?: string;
  details?: string;
}

export interface AuthSuccess {
  success: true;
  token: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  returnTo?: string;
}

export type AuthResponse = AuthSuccess | AuthError;