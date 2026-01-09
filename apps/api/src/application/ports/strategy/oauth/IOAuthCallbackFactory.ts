import { ServiceProvider } from "@harmonia/shared";
import { IOAuthCallbackStrategy } from "./IOAuthCallbackStrategy";

export interface IOAuthCallbackFactory {
  getStrategy(provider: ServiceProvider): IOAuthCallbackStrategy;
}