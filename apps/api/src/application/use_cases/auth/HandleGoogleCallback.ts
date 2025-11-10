import { Container } from '@/main/container';
import { AuthResponse, OAuthCallbackData, OAuthMethod, ServiceProvider } from '@harmonia/shared';
import { IGoogleOAuthClient } from '../../ports/oauth/IGoogleOAuthClient';
import { IOAuthStateStore } from '../../ports/oauth/IOAuthStateStore';

export class HandleGoogleCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly google: IGoogleOAuthClient,
  ) { }

  async execute(input: OAuthCallbackData): Promise<AuthResponse> {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: 'invalid_state_or_code' };
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      return { success: false, error: "no_account", message: "Nenhum usuário conectado" }
    }
    this.stateStore.delete(input.state);
    const exchangeData = await this.google.exchangeCode(input.code);

    const instancedStrategy = Container.getStrategyFactory().getStrategy(ServiceProvider.GOOGLE);

    return await instancedStrategy.processCallback(exchangeData, stateData, stateData.userId)
  }
}