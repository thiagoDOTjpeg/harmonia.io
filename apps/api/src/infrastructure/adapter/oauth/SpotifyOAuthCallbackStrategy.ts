import { OAuthCallbackStrategy } from "@/application/ports/strategy/OAuthCallbackStrategy";
import { AuthResponse } from "@harmonia/shared";

export class SpotifyOAuthCallbackStrategy implements OAuthCallbackStrategy {
  public processCallback(): Promise<AuthResponse> {

  }
}