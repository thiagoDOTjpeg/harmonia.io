import { OAuthMethod } from "../../enum/oauth";

export interface OAuthState {
  method: OAuthMethod;
  returnTo?: string;
}