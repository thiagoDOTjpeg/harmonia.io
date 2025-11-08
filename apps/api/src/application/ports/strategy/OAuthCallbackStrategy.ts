import { AuthResponse, OAuthProviderResult, OAuthState } from "@harmonia/shared";

export interface OAuthCallbackStrategy<T extends OAuthProviderResult = OAuthProviderResult> {
  processCallback(exchangeData: T, state: OAuthState, userId?: string): Promise<AuthResponse>;
}