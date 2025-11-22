import { TokenResponse } from "@/types/token";

export interface ITokenManager {
  sign(payload: object): string;
  decode(token: string): TokenResponse;
}