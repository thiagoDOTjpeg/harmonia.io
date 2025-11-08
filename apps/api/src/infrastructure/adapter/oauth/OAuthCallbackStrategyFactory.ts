import { OAuthCallbackStrategy } from "@/application/ports/strategy/OAuthCallbackStrategy";
import { ServiceProvider } from "@harmonia/shared";
import { GoogleOAuthCallbackStrategy } from "./GoogleOAuthCallbackStrategy";
import { SpotifyOAuthCallbackStrategy } from "./SpotifyOAuthCallbackStrategy";

export class OAuthCallbackStrategyFactory {

  private strategies: Record<ServiceProvider, new (...args: any[]) => OAuthCallbackStrategy>

  constructor() {
    this.strategies = {
      [ServiceProvider.GOOGLE]: GoogleOAuthCallbackStrategy,
      [ServiceProvider.SPOTIFY]: SpotifyOAuthCallbackStrategy,
    }
  }
  getStrategy(serviceProvider: ServiceProvider): new (...args: any[]) => OAuthCallbackStrategy {
    return this.strategies[serviceProvider]
  }
}