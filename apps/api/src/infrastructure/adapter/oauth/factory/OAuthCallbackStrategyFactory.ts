import { IOAuthCallbackStrategy } from "@/application/ports/strategy/IOAuthCallbackStrategy";
import { BadRequestError, ServiceProvider } from "@harmonia/shared";

export class OAuthCallbackStrategyFactory {
  constructor(private strategies: Record<ServiceProvider, IOAuthCallbackStrategy>) {
  }

  create(serviceProvider: ServiceProvider): IOAuthCallbackStrategy {
    const strategy = this.strategies[serviceProvider];
    if (!strategy) throw new BadRequestError("Serviço não suportado");
    return strategy;
  }
}