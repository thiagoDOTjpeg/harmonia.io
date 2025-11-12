import { AuthResponse, OAuthState } from "@harmonia/shared";

export interface IOAuthCallbackStrategy {
  processCallback(state: OAuthState, userId?: string): Promise<AuthResponse>;
}