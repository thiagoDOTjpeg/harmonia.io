import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUrlProviderFactory";
import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { BadRequestError, ServiceProvider } from "@harmonia/shared";

export class OAuthUrlFactory implements IAuthUrlProviderFactory {
  private readonly authProviders: Record<ServiceProvider, IAuthUrlProvider>;

  constructor(authProviders: Record<ServiceProvider, IAuthUrlProvider>) {
    this.authProviders = authProviders;
  }

  getStrategy(serviceProvider: ServiceProvider): IAuthUrlProvider {
    const authProvider = this.authProviders[serviceProvider];
    if (!authProvider) throw new BadRequestError("Serviço não suportado")
    return authProvider;
  }

}