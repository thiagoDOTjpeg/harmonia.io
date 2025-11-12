import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { IOAuthStateStore } from "@/application/ports/oauth/IOAuthStateStore";
import { OAuthMethod } from "@harmonia/shared";

export class StartOAuthUseCase {
  constructor(
    private readonly stateStore: IOAuthStateStore,
  ) { }
  async execute(method: OAuthMethod, authProvider: IAuthUrlProvider, returnTo?: string, userId?: string) {
    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { method, returnTo, userId });
    const redirectTo = authProvider.buildAuthUrl(state);
    return { redirectTo }
  }
}