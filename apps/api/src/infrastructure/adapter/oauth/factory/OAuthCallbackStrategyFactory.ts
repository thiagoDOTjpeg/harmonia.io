import { IOAuthCallbackFactory } from "@/application/ports/strategy/oauth/IOAuthCallbackFactory";
import { IOAuthCallbackStrategy } from "@/application/ports/strategy/oauth/IOAuthCallbackStrategy";
import { ERRORS } from "@/types/constant/errors";
import { BadRequestError, ServiceProvider } from "@harmonia/shared";

export class OAuthCallbackStrategyFactory implements IOAuthCallbackFactory {
  constructor(private strategies: Record<ServiceProvider, IOAuthCallbackStrategy>) {
  }

  getStrategy(serviceProvider: ServiceProvider): IOAuthCallbackStrategy {
    const strategy = this.strategies[serviceProvider];
    if (!strategy) throw new BadRequestError(ERRORS.SERVICE_CONNECTION_INVALID);
    return strategy;
  }
}