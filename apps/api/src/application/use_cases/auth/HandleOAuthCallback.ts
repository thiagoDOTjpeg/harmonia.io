import { IOAuthStateStore } from "@/application/ports/oauth/IOAuthStateStore";
import { OAuthCallbackStrategyFactory } from "@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory";
import { OAuthCallbackData, OAuthMethod, ServiceProvider } from "@harmonia/shared";

export class HandleOAuthCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly strategyFactory: OAuthCallbackStrategyFactory
  ) { }

  async execute(provider: ServiceProvider, input: OAuthCallbackData) {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: "invalid_state_or_code" }
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      return { success: false, error: "no_account", message: "Nenhum usuário conectado" }
    }
    this.stateStore.delete(input.state);

    const strategy = this.strategyFactory.create(provider);

    return await strategy.processCallback(stateData, stateData.userId)
  }
}