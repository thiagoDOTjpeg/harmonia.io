import { OAuthMethod } from "@harmonia/shared";

export interface OAuthState {
  method: OAuthMethod;
  returnTo?: string;
  userId?: string;
}
