import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { OAuthCallbackStrategyFactory } from "@/infrastructure/adapter/oauth/factory/OAuthCallbackStrategyFactory";
import { OAuthCallbackData } from "@/types/oauth/callback";
import { OAuthState } from "@/types/oauth/state";
import { NotFoundError, OAuthMethod, ServiceProvider } from "@harmonia/shared";

export class HandleOAuthCallbackUseCase {
  constructor(
    private readonly stateStore: IStateStore<OAuthState>,
    private readonly strategyFactory: OAuthCallbackStrategyFactory
  ) { }

  async execute(provider: ServiceProvider, input: OAuthCallbackData) {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) throw new NotFoundError("State não encontrado")
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      throw new NotFoundError("Nenhum usuário conectado")
    }
    await this.stateStore.delete(input.state);

    const strategy = this.strategyFactory.create(provider);

    return await strategy.processCallback(input.code, stateData, stateData.userId)
  }
}