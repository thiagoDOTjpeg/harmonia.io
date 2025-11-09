import { IGoogleOAuthClient } from "@/application/ports/oauth/IGoogleOAuthClient";
import { IOAuthStateStore } from "@/application/ports/oauth/IOAuthStateStore";
import { OAuthMethod } from "@harmonia/shared";

export class StartGoogleConnect {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly google: IGoogleOAuthClient,
  ) { }

  async execute(returnTo?: string, userId?: string) {
    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { method: OAuthMethod.connect, returnTo, userId });
    const redirectTo = this.google.buildAuthUrl(state);
    return { redirectTo }
  }
}