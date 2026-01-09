import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IOAuthCallbackFactory } from "@/application/ports/strategy/oauth/IOAuthCallbackFactory";
import { ERRORS } from "@/types/constant/errors";
import { OAuthCallbackData } from "@/types/oauth/callback";
import { OAuthState } from "@/types/oauth/state";
import { NotFoundError, OAuthMethod, ServiceProvider } from "@harmonia/shared";

export class HandleOAuthCallbackUseCase {
  constructor(
    private readonly stateStore: IStateStore<OAuthState>,
    private readonly strategyFactory: IOAuthCallbackFactory
  ) { }

  async execute(provider: ServiceProvider, input: OAuthCallbackData) {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) throw new NotFoundError(ERRORS.STATE_NOT_FOUND);
    if (stateData.method === OAuthMethod.connect && !stateData.userId) {
      throw new NotFoundError(ERRORS.USER_NOT_CONNECTED);
    }
    await this.stateStore.delete(input.state);

    const strategy = this.strategyFactory.getStrategy(provider);
    const result = await strategy.processCallback(input.code, stateData, stateData.userId)

    return result;
  }
}