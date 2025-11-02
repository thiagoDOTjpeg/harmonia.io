import { TokenResponse } from '@harmonia/shared';

export interface ITokenManager {
  sign(payload: object): string;
  decode(token: string): TokenResponse;
}