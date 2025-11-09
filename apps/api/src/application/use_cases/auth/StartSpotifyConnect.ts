import { IOAuthStateStore } from "@/application/ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "@/application/ports/oauth/ISpotifyOAuthClient";
import { OAuthMethod } from "@harmonia/shared";

export class StartSpotifyConnect {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
  ) { }

  async execute(returnTo?: string, userId?: string) {
    const state = Math.random().toString(36).slice(2);
    await this.stateStore.set(state, { method: OAuthMethod.connect, returnTo, userId });
    const redirectTo = this.spotify.buildAuthUrl(state);
    return { redirectTo }
  }
}