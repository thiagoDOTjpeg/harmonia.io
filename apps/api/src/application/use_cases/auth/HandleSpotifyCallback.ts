import { IServiceConnectionRepository } from '@/application/repositories/IServiceConnectionRepository';
import { OAuthCallbackStrategyFactory } from '@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory';
import { AuthResponse, OAuthCallbackData, ServiceProvider } from '@harmonia/shared';
import { IClock } from "../../ports/clock/IClock";
import { ITokenManager } from "../../ports/crypto/ITokenManager";
import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "../../ports/oauth/ISpotifyOAuthClient";
import { IUserRepository } from "../../repositories/IUserRepository";

export class HandleSpotifyCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly users: IUserRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
  ) { }

  async execute(input: OAuthCallbackData): Promise<AuthResponse> {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: "invalid_state_or_code" }
    this.stateStore.delete(input.state);
    const exchangeData = await this.spotify.exchangeCode(input.code);

    const strategy = new OAuthCallbackStrategyFactory().getStrategy(ServiceProvider.SPOTIFY);
    const instancedStrategy = new strategy(this.users, this.serviceConnection, this.tokens, this.clock);

    return await instancedStrategy.processCallback(exchangeData, stateData, stateData.userId);
  }
}