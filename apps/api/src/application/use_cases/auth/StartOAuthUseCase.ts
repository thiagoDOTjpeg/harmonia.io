import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUIrlProviderFactory";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { OAuthState } from "@/types/oauth/state";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";

export class StartOAuthUseCase {
  constructor(
    private readonly stateStore: IStateStore<OAuthState>,
    private readonly authFactory: IAuthUrlProviderFactory,
  ) { }
  async execute(method: OAuthMethod, serviceProvider: ServiceProvider, returnTo?: string, userId?: string) {
    const authProvider = this.authFactory.getStrategy(serviceProvider);

    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { method, returnTo, userId }, 600);

    const redirectTo = authProvider.buildAuthUrl(state);
    return { redirectTo }
  }
}