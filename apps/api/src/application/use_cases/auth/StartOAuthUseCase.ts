import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { OAuthState } from "@/types/oauth/state";
import { OAuthMethod } from "@harmonia/shared";

export class StartOAuthUseCase {
  constructor(
    private readonly stateStore: IStateStore<OAuthState>,
  ) { }
  async execute(method: OAuthMethod, authProvider: IAuthUrlProvider, returnTo?: string, userId?: string) {
    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { method, returnTo, userId }, 600);
    const redirectTo = authProvider.buildAuthUrl(state);
    return { redirectTo }
  }
}