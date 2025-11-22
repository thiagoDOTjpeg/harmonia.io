import { OAuthState } from "@/types/oauth/state";
import { AuthResponse } from "@harmonia/shared";

export interface IOAuthCallbackStrategy {
  processCallback(code: string, state: OAuthState, userId?: string): Promise<AuthResponse>;
}