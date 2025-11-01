import { TokenResponse } from "../../../shared/types/oauth/token";

export interface ITokenManager {
  sign(payload: object): string;
  decode(token: string): TokenResponse;
}