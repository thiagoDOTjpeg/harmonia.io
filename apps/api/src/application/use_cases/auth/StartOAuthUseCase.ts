import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUrlProviderFactory";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { OAuthState } from "@/types/oauth/state";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { randomBytes } from "crypto";

export class StartOAuthUseCase {
  constructor(
    private readonly stateStore: IStateStore<OAuthState>,
    private readonly authFactory: IAuthUrlProviderFactory,
  ) { }
  async execute(method: OAuthMethod, serviceProvider: ServiceProvider, returnTo?: string, userId?: string) {
    const authProvider = this.authFactory.getStrategy(serviceProvider);

    const state = this.randomState();
    await this.stateStore.set(state, { method, returnTo, userId }, 600);

    const redirectTo = authProvider.buildAuthUrl(state);
    return { redirectTo }
  }

  private randomState() {
    const randomBuffer = randomBytes(32);
    return randomBuffer.toString("base64url");
  }
}