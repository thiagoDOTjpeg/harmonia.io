import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { RegisterWithOAuthUseCase } from "@/application/use_cases/auth/RegisterWithOAuthUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockTokenManager } from "@/tests/factories/MockTokenManager";
import { createMockUserRepository } from "@/tests/factories/MockUserRepositoryFactory";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import { InvalidCredentialsError, OAuthMethod, ServiceProvider } from "@harmonia/shared";

describe("RegisterWithOAuthUseCase", () => {
  let useCase: RegisterWithOAuthUseCase;
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
    email: "User@Example.com",
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

    useCase = new RegisterWithOAuthUseCase(
      mockUserRepository,
      mockServiceConnectionRepository,
      mockTokenManager,
      mockClock,
      mockEncryptor,
      mockSerializer,
    );
  });

  it("should register a new user, create service connection, and return AuthResponse", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockImplementation(async (user) => user);
    mockServiceConnectionRepository.createServiceConnection.mockImplementation(
      async (data) =>
        new ServiceConnection(
          "conn-1",
          data.userId,
          ServiceProvider.GOOGLE,
          data.providerAccountId as string,
          (data.email as string | null) ?? null,
          data.accessToken as string,
          data.expiresAt as Date,
          data.scopes as string,
          null,
          fixedNow,
          fixedNow,
          (data.refreshToken as string | null) ?? null,
        ),
    );
    mockTokenManager.sign.mockReturnValue("jwt-token-123");

    const result = await useCase.execute(validInput);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("user@example.com");
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockServiceConnectionRepository.createServiceConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        providerAccountId: "google-sub-123",
        accessToken: "ser:enc:access-token-123",
        refreshToken: "ser:enc:refresh-token-123",
        expiresAt: new Date(fixedNow.getTime() + (3600 - 60) * 1000),
        scopes: "openid email profile",
        metadata: { youtubeChannelId: "yt-123" },
      }),
    );
    expect(result).toEqual({
      token: "jwt-token-123",
      isPasswordSetupRequired: true,
      user: {
        id: expect.any(String),
        email: "user@example.com",
        name: "Test User",
      },
      method: OAuthMethod.register,
      returnTo: "/dashboard",
    });
  });

  it("should throw InvalidCredentialsError when email or name is missing", async () => {
    await expect(
      useCase.execute({ ...validInput, email: "" }),
    ).rejects.toThrow(new InvalidCredentialsError(ERRORS.OAUTH_INVALID_CREDENTIALS));

    await expect(
      useCase.execute({ ...validInput, name: "" }),
    ).rejects.toThrow(new InvalidCredentialsError(ERRORS.OAUTH_INVALID_CREDENTIALS));
  });

  it("should throw InvalidCredentialsError when user already exists", async () => {
    const existingUser = new UserBuilder().build();
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      new InvalidCredentialsError(ERRORS.OAUTH_USER_ALREADY_EXISTIS),
    );

    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockServiceConnectionRepository.createServiceConnection).not.toHaveBeenCalled();
  });
});
