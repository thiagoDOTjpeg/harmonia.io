import { OAuthCallbackStrategy } from "@/application/ports/strategy/OAuthCallbackStrategy";
import { ServiceProvider } from "@harmonia/shared";

export class OAuthCallbackStrategyFactory {
  constructor(private strategies: Record<ServiceProvider, OAuthCallbackStrategy>) {
  }

  getStrategy(serviceProvider: ServiceProvider): OAuthCallbackStrategy {
    return this.strategies[serviceProvider]
  }
}