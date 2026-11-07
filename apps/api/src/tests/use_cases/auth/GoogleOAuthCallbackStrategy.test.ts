import { ICodeExchanger } from "@/application/ports/oauth/ICodeExchanger";
import { ConnectServiceUseCase } from "@/application/use_cases/auth/ConnectServiceUseCase";
import { LoginWithOAuthUseCase } from "@/application/use_cases/auth/LoginWithOAuthUseCase";
import { RegisterWithOAuthUseCase } from "@/application/use_cases/auth/RegisterWithOAuthUseCase";
import { GoogleOAuthCallbackStrategy } from "@/infrastructure/adapter/oauth/strategy/GoogleOAuthCallbackStrategy";
import { GoogleOAuthResult } from "@/types/oauth/results";
import { AuthResponse, OAuthMethod, ServiceProvider } from "@harmonia/shared";

describe("GoogleOAuthCallbackStrategy", () => {
  let strategy: GoogleOAuthCallbackStrategy;
  let mockGoogleClient: jest.Mocked<ICodeExchanger<GoogleOAuthResult>>;
  let mockRegisterUseCase: jest.Mocked<RegisterWithOAuthUseCase>;
  let mockLoginUseCase: jest.Mocked<LoginWithOAuthUseCase>;
  let mockConnectUseCase: jest.Mocked<ConnectServiceUseCase>;

  const exchangeResult: GoogleOAuthResult = {
    tokens: {
      access_token: "google-access-123",
      refresh_token: "google-refresh-123",
      expires_in: 3600,
    },
    profile: {
      sub: "google-sub-123",
      email: "user@example.com",
      name: "Google User",
      email_verified: true,
    },
    youtubeChannelId: "yt-channel-123",
  };

  const mockAuthResponse: AuthResponse = {
    token: "jwt-123",
    isPasswordSetupRequired: false,
    user: {
      id: "user-1",
      email: "user@example.com",
      name: "Google User",
    },
    method: OAuthMethod.login,
    returnTo: "/dashboard",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockGoogleClient = {
      exchangeCode: jest.fn().mockResolvedValue(exchangeResult),
    };
    mockRegisterUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...mockAuthResponse,
        method: OAuthMethod.register,
        isPasswordSetupRequired: true,
      }),
    } as unknown as jest.Mocked<RegisterWithOAuthUseCase>;
    mockLoginUseCase = {
      execute: jest.fn().mockResolvedValue(mockAuthResponse),
    } as unknown as jest.Mocked<LoginWithOAuthUseCase>;
    mockConnectUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...mockAuthResponse,
        method: OAuthMethod.connect,
      }),
    } as unknown as jest.Mocked<ConnectServiceUseCase>;

    strategy = new GoogleOAuthCallbackStrategy(
      mockGoogleClient,
      mockRegisterUseCase,
      mockLoginUseCase,
      mockConnectUseCase,
    );
  });

  it("should normalize Google data and delegate to RegisterWithOAuthUseCase when method is register", async () => {
    const result = await strategy.processCallback("code-123", {
      method: OAuthMethod.register,
      returnTo: "/dashboard",
    });

    expect(mockGoogleClient.exchangeCode).toHaveBeenCalledWith("code-123");
    expect(mockRegisterUseCase.execute).toHaveBeenCalledWith({
      provider: ServiceProvider.GOOGLE,
      providerAccountId: "google-sub-123",
      email: "user@example.com",
      name: "Google User",
      accessToken: "google-access-123",
      refreshToken: "google-refresh-123",
      expiresIn: 3600,
      scopes: expect.stringContaining("youtube.readonly"),
      metadata: { youtubeChannelId: "yt-channel-123" },
      returnTo: "/dashboard",
    });
    expect(result.method).toBe(OAuthMethod.register);
  });

  it("should normalize Google data and delegate to LoginWithOAuthUseCase when method is login", async () => {
    const result = await strategy.processCallback("code-123", {
      method: OAuthMethod.login,
      returnTo: "/dashboard",
    });

    expect(mockGoogleClient.exchangeCode).toHaveBeenCalledWith("code-123");
    expect(mockLoginUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: ServiceProvider.GOOGLE,
        providerAccountId: "google-sub-123",
        email: "user@example.com",
      }),
    );
    expect(result.method).toBe(OAuthMethod.login);
  });

  it("should normalize Google data and delegate to ConnectServiceUseCase when method is connect", async () => {
    const result = await strategy.processCallback(
      "code-123",
      {
        method: OAuthMethod.connect,
        returnTo: "/settings",
      },
      "logged-user-123",
    );

    expect(mockGoogleClient.exchangeCode).toHaveBeenCalledWith("code-123");
    expect(mockConnectUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: ServiceProvider.GOOGLE,
        providerAccountId: "google-sub-123",
        loggedUserId: "logged-user-123",
        returnTo: "/settings",
      }),
    );
    expect(result.method).toBe(OAuthMethod.connect);
  });
});

