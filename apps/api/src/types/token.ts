export interface Token {
  sub: string;
  iat?: string;
  exp?: string;
}
export interface TokenSuccess {
  token: Token;
}

export type TokenResponse = TokenSuccess