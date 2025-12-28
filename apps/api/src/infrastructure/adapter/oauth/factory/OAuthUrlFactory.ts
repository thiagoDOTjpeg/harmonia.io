import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUIrlProviderFactory";
import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { ServiceProvider } from "@harmonia/shared";

export class OAuthUrlFactory implements IAuthUrlProviderFactory {
  private readonly authProviders: Record<ServiceProvider, IAuthUrlProvider>;

  constructor(authProviders: Record<ServiceProvider, IAuthUrlProvider>) {
    this.authProviders = authProviders;
  }

  getStrategy(serviceProvider: ServiceProvider): IAuthUrlProvider {
    return this.authProviders[serviceProvider];
  }

}