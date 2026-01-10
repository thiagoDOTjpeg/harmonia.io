import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUrlProviderFactory";
import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { ERRORS } from "@/types/constant/errors";
import { BadRequestError, ServiceProvider } from "@harmonia/shared";

export class OAuthUrlFactory implements IAuthUrlProviderFactory {
  private readonly authProviders: Record<ServiceProvider, IAuthUrlProvider>;

  constructor(authProviders: Record<ServiceProvider, IAuthUrlProvider>) {
    this.authProviders = authProviders;
  }

  getStrategy(serviceProvider: ServiceProvider): IAuthUrlProvider {
    const authProvider = this.authProviders[serviceProvider];
    if (!authProvider) throw new BadRequestError(ERRORS.SERVICE_CONNECTION_INVALID)
    return authProvider;
  }

}