import { ICodeExchanger } from "@/application/ports/oauth/ICodeExchanger";
import { IOAuthCallbackStrategy } from "@/application/ports/strategy/oauth/IOAuthCallbackStrategy";
import { ConnectServiceUseCase } from "@/application/use_cases/auth/ConnectServiceUseCase";
import { LoginWithOAuthUseCase } from "@/application/use_cases/auth/LoginWithOAuthUseCase";
import { RegisterWithOAuthUseCase } from "@/application/use_cases/auth/RegisterWithOAuthUseCase";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import { SpotifyOAuthResult } from "@/types/oauth/results";
import { OAuthState } from "@/types/oauth/state";
import { AuthResponse, OAuthMethod, ServiceProvider } from "@harmonia/shared";

const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
].join(' ');

export class SpotifyOAuthCallbackStrategy implements IOAuthCallbackStrategy {
  constructor(
    private readonly spotify: ICodeExchanger<SpotifyOAuthResult>,
    private readonly registerWithOAuthUseCase: RegisterWithOAuthUseCase,
    private readonly loginWithOAuthUseCase: LoginWithOAuthUseCase,
    private readonly connectServiceUseCase: ConnectServiceUseCase,
  ) { }

  async processCallback(
    code: string,
    OAuthState: OAuthState,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    const exchangeData = await this.spotify.exchangeCode(code);
    const { method, returnTo } = OAuthState;

    const normalizedData: OAuthNormalizedData = {
      provider: ServiceProvider.SPOTIFY,
      providerAccountId: exchangeData.profile.id,
      email: exchangeData.profile.email,
      name: exchangeData.profile.display_name,
      accessToken: exchangeData.tokens.access_token,
      refreshToken: exchangeData.tokens.refresh_token,
      expiresIn: exchangeData.tokens.expires_in,
      scopes: SCOPES,
      returnTo,
    };

    switch (method) {
      case OAuthMethod.register:
        return this.registerWithOAuthUseCase.execute(normalizedData);

      case OAuthMethod.login:
        return this.loginWithOAuthUseCase.execute(normalizedData);

      case OAuthMethod.connect:
        return this.connectServiceUseCase.execute({
          ...normalizedData,
          loggedUserId,
        });
    }
  }
}
