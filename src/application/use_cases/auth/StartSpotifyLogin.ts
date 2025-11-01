import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "../../ports/oauth/ISpotifyOAuthClient";

export class StartSpotifyLogin {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
  ) { }

  execute(returnTo?: string) {
    const state = Math.random().toString(36).slice(2);
    this.stateStore.set(state, { mode: 'login', returnTo });
    const redirectTo = this.spotify.buildAuthUrl(state);
    return { redirectTo }
  }
}