import { IGoogleOAuthClient } from "../../ports/oauth/IGoogleOAuthClient";
import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";

export class StartGoogleLogin {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly google: IGoogleOAuthClient,
  ) { }

  execute(returnTo?: string) {
    const state = Math.random().toString(36).slice(2);
    this.stateStore.set(state, { mode: 'login', returnTo });
    const redirectTo = this.google.buildAuthUrl(state);
    return { redirectTo };
  }
}