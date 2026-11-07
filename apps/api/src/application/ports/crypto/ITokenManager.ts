import { TokenResponse } from "@/types/token";

export interface ITokenManager {
  sign(payload: object, expiresIn?: string): string;
  decode(token: string): TokenResponse;
}
