import { OAuthMethod } from "../../enum/oauth";

export interface OAuthState {
  code: string,
  method: OAuthMethod;
  returnTo?: string;
  userId?: string;
}