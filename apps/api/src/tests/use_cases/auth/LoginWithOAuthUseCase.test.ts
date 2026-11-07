import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { LoginWithOAuthUseCase } from "@/application/use_cases/auth/LoginWithOAuthUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockTokenManager } from "@/tests/factories/MockTokenManager";
import { createMockUserRepository } from "@/tests/factories/MockUserRepositoryFactory";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import {
  InvalidCredentialsError,
  NotFoundError,
  OAuthMethod,
  ServiceProvider,
} from "@harmonia/shared";

describe("LoginWithOAuthUseCase", () => {
  let useCase: LoginWithOAuthUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockServiceConnectionRepository: jest.Mocked<IServiceConnectionRepository>;
  let mockTokenManager: jest.Mocked<ITokenManager>;
  let mockClock: jest.Mocked<IClock>;
  let mockEncryptor: jest.Mocked<IEncryptor>;
  let mockSerializer: jest.Mocked<ITokenSerializer<TokenEncrypted>>;

  const fixedNow = new Date("2026-01-01T12:00:00.000Z");

  const validInput: OAuthNormalizedData = {
    provider: ServiceProvider.GOOGLE,
    providerAccountId: "google-sub-123",
    email: "user@example.com",
    name: "Test User",
    accessToken: "access-token-123",
    refreshToken: "refresh-token-123",
    expiresIn: 3600,
    scopes: "openid email profile",
    metadata: { youtubeChannelId: "yt-123" },
    returnTo: "/dashboard",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository();
    mockServiceConnectionRepository = {
      findByEmail: jest.fn(),
      findByEmailAndServiceProvider: jest.fn(),
      findByService: jest.fn(),
      findByServiceId: jest.fn(),
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      createServiceConnection: jest.fn(),
      updateServiceConnection: jest.fn(),
    };
    mockTokenManager = createMockTokenManager();
    mockClock = {
      now: jest.fn().mockReturnValue(fixedNow),
    };
    mockEncryptor = {
      encrypt: jest.fn().mockImplementation((val: string) => ({
        iv: "iv",
        cipherText: `enc:${val}`,
        tag: "tag",
      })),
      decrypt: jest.fn(),
    };
    mockSerializer = {
      serialize: jest
        .fn()
        .mockImplementation((data: TokenEncrypted) => `ser:${data.cipherText}`),
      deserialize: jest.fn(),
    };

    useCase = new LoginWithOAuthUseCase(
      mockUserRepository,
      mockServiceConnectionRepository,
      mockTokenManager,
      mockClock,
      mockEncryptor,
      mockSerializer,
    );
  });

  it("should login and create service connection when none exists", async () => {
    const user = new UserBuilder().withEmail("user@example.com").build();
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockServiceConnectionRepository.findByServiceId.mockResolvedValue(null);
    mockServiceConnectionRepository.createServiceConnection.mockResolvedValue(
      new ServiceConnection(
        "conn-1",
        user.id,
        ServiceProvider.GOOGLE,
        validInput.providerAccountId,
        user.email,
        "ser:enc:access-token-123",
        fixedNow,
        validInput.scopes,
        null,
        fixedNow,
        fixedNow,
        "ser:enc:refresh-token-123",
      ),
    );
    mockTokenManager.sign.mockReturnValue("jwt-token-123");

    const result = await useCase.execute(validInput);

    expect(mockServiceConnectionRepository.createServiceConnection).toHaveBeenCalledTimes(1);
    expect(mockServiceConnectionRepository.updateServiceConnection).not.toHaveBeenCalled();
    expect(result).toEqual({
      token: "jwt-token-123",
      isPasswordSetupRequired: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      method: OAuthMethod.login,
      returnTo: "/dashboard",
    });
  });

  it("should login and update existing service connection when owned by same user", async () => {
    const user = new UserBuilder().withEmail("user@example.com").build();
    const existingConn = new ServiceConnection(
      "conn-1",
      user.id,
      ServiceProvider.GOOGLE,
      validInput.providerAccountId,
      user.email,
      "old-access",
      fixedNow,
      validInput.scopes,
      null,
      fixedNow,
      fixedNow,
      "old-refresh",
    );

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockServiceConnectionRepository.findByServiceId.mockResolvedValue(existingConn);
    mockServiceConnectionRepository.updateServiceConnection.mockResolvedValue(existingConn);
    mockTokenManager.sign.mockReturnValue("jwt-token-123");

    const result = await useCase.execute(validInput);

    expect(mockServiceConnectionRepository.updateServiceConnection).toHaveBeenCalledTimes(1);
    expect(mockServiceConnectionRepository.createServiceConnection).not.toHaveBeenCalled();
    expect(result.token).toBe("jwt-token-123");
  });

  it("should throw NotFoundError when user does not exist", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      new NotFoundError(ERRORS.OAUTH_USER_NOT_FOUND),
    );
  });

  it("should throw InvalidCredentialsError when service connection is linked to another user", async () => {
    const user = new UserBuilder().withEmail("user@example.com").build();
    const otherUserConn = new ServiceConnection(
      "conn-1",
      "another-user-id",
      ServiceProvider.GOOGLE,
      validInput.providerAccountId,
      "other@example.com",
      "access",
      fixedNow,
      validInput.scopes,
      null,
      fixedNow,
      fixedNow,
      "refresh",
    );

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockServiceConnectionRepository.findByServiceId.mockResolvedValue(otherUserConn);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      new InvalidCredentialsError(ERRORS.GOOGLE_ACCOUNT_ALREADY_LINKED),
    );
  });
});

