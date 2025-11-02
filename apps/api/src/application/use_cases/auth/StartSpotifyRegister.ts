import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "../../ports/oauth/ISpotifyOAuthClient";

export class StartSpotifyRegister {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
  ) { }

  async execute(returnTo?: string) {
    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { mode: 'register', returnTo });
    const redirectTo = this.spotify.buildAuthUrl(state);
    return { redirectTo };
  }
}