import { Container } from '@/main/container';
import { AuthResponse, OAuthCallbackData, OAuthMethod, ServiceProvider } from '@harmonia/shared';
import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "../../ports/oauth/ISpotifyOAuthClient";

export class HandleSpotifyCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
  ) { }

  async execute(input: OAuthCallbackData): Promise<AuthResponse> {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: "invalid_state_or_code" }
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      return { success: false, error: "no_account", message: "Nenhum usuário conectado" }
    }
    this.stateStore.delete(input.state);
    const exchangeData = await this.spotify.exchangeCode(input.code);

    const instancedStrategy = Container.getStrategyFactory().getStrategy(ServiceProvider.SPOTIFY);

    return await instancedStrategy.processCallback(exchangeData, stateData, stateData.userId);
  }
}