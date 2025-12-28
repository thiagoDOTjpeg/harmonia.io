import { IOAuthCallbackStrategy } from "@/application/ports/strategy/IOAuthCallbackStrategy";
import { ServiceProvider } from "@harmonia/shared";

export class OAuthCallbackStrategyFactory {
  constructor(private strategies: Record<ServiceProvider, IOAuthCallbackStrategy>) {
  }

  create(serviceProvider: ServiceProvider): IOAuthCallbackStrategy {
    return this.strategies[serviceProvider]
  }
}