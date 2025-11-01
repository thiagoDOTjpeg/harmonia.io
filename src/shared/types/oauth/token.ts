export interface Token {
  sub: string;
  iat?: string;
  exp?: string;
}

export type TokenErrorCode =
  | 'invalid_token'
  | 'invalid_token_secret'

export interface TokenError {
  error: TokenErrorCode;
  message?: string;
  details?: string;
}

export interface TokenSuccess {
  token: Token;
}

export type TokenResponse = TokenSuccess | TokenError