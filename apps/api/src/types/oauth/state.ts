import { OAuthMethod } from "@harmonia/shared/src/enum/oauth";

export interface OAuthState {
  method: OAuthMethod;
  returnTo?: string;
  userId?: string;
}
