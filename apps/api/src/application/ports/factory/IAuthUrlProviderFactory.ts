import { ServiceProvider } from "@harmonia/shared";
import { IAuthUrlProvider } from "../oauth/IAuthUrlProvider";

export interface IAuthUrlProviderFactory {
  getStrategy(serviceProvider: ServiceProvider): IAuthUrlProvider;
}