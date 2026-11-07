import { ICodeExchanger } from "@/application/ports/oauth/ICodeExchanger";
import { IOAuthCallbackStrategy } from "@/application/ports/strategy/oauth/IOAuthCallbackStrategy";
import { ConnectServiceUseCase } from "@/application/use_cases/auth/ConnectServiceUseCase";
import { LoginWithOAuthUseCase } from "@/application/use_cases/auth/LoginWithOAuthUseCase";
import { RegisterWithOAuthUseCase } from "@/application/use_cases/auth/RegisterWithOAuthUseCase";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import { GoogleOAuthResult } from "@/types/oauth/results";
import { OAuthState } from "@/types/oauth/state";
import { AuthResponse, OAuthMethod, ServiceProvider } from "@harmonia/shared";

const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

export class GoogleOAuthCallbackStrategy implements IOAuthCallbackStrategy {
  constructor(
    private readonly google: ICodeExchanger<GoogleOAuthResult>,
    private readonly registerWithOAuthUseCase: RegisterWithOAuthUseCase,
    private readonly loginWithOAuthUseCase: LoginWithOAuthUseCase,
    private readonly connectServiceUseCase: ConnectServiceUseCase,
  ) { }

  async processCallback(
    code: string,
    OAuthState: OAuthState,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    const exchangeData = await this.google.exchangeCode(code);
    const { method, returnTo } = OAuthState;

    const normalizedData: OAuthNormalizedData = {
      provider: ServiceProvider.GOOGLE,
      providerAccountId: exchangeData.profile.sub,
      email: exchangeData.profile.email,
      name: exchangeData.profile.name,
      accessToken: exchangeData.tokens.access_token,
      refreshToken: exchangeData.tokens.refresh_token,
      expiresIn: exchangeData.tokens.expires_in,
      scopes: SCOPES,
      metadata: {
        youtubeChannelId: exchangeData?.youtubeChannelId || ""
      },
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
