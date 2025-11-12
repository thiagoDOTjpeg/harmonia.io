import { AuthResponse, OAuthState } from "@harmonia/shared";

export interface IOAuthCallbackStrategy {
  processCallback(code: string, state: OAuthState, userId?: string): Promise<AuthResponse>;
}