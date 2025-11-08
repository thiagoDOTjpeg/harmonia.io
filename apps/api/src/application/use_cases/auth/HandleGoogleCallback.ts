import { IServiceConnectionRepository } from '@/application/repositories/IServiceConnectionRepository';
import { OAuthCallbackStrategyFactory } from '@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory';
import { AuthResponse, OAuthCallbackData, ServiceProvider } from '@harmonia/shared';
import { IClock } from '../../ports/clock/IClock';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IGoogleOAuthClient } from '../../ports/oauth/IGoogleOAuthClient';
import { IOAuthStateStore } from '../../ports/oauth/IOAuthStateStore';
import { IUserRepository } from '../../repositories/IUserRepository';

export class HandleGoogleCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly google: IGoogleOAuthClient,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly users: IUserRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
    private readonly userId: string | undefined
  ) { }

  async execute(input: OAuthCallbackData): Promise<AuthResponse> {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: 'invalid_state_or_code' };
    this.stateStore.delete(input.state);
    const exchangeData = await this.google.exchangeCode(input.code);

    const strategy = new OAuthCallbackStrategyFactory().getStrategy(ServiceProvider.GOOGLE);
    const instancedStrategy = new strategy(this.users, this.serviceConnection, this.tokens, this.clock);

    return await instancedStrategy.processCallback(exchangeData, stateData, this.userId)
  }
}