import { IOAuthStateStore } from "@/application/ports/oauth/IOAuthStateStore";
import { OAuthCallbackStrategyFactory } from "@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory";
import { NotFoundError, OAuthCallbackData, OAuthMethod, ServiceProvider } from "@harmonia/shared";

export class HandleOAuthCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly strategyFactory: OAuthCallbackStrategyFactory
  ) { }

  async execute(provider: ServiceProvider, input: OAuthCallbackData) {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) throw new NotFoundError("State não encontrado")
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      throw new NotFoundError("Nenhum usuário conectado")
    }
    this.stateStore.delete(input.state);

    const strategy = this.strategyFactory.create(provider);

    return await strategy.processCallback(input.code, stateData, stateData.userId)
  }
}