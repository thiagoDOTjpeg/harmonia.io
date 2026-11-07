import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ConnectServiceUseCase } from "@/application/use_cases/auth/ConnectServiceUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockTokenManager } from "@/tests/factories/MockTokenManager";
import { createMockUserRepository } from "@/tests/factories/MockUserRepositoryFactory";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { ConnectServiceInput } from "@/types/oauth/callback";
import {
  InvalidCredentialsError,
  NotFoundError,
  OAuthMethod,
  ServiceProvider,
  UnathorizedError,
} from "@harmonia/shared";

describe("ConnectServiceUseCase", () => {
  let useCase: ConnectServiceUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockServiceConnectionRepository: jest.Mocked<IServiceConnectionRepository>;
  let mockTokenManager: jest.Mocked<ITokenManager>;
  let mockClock: jest.Mocked<IClock>;
  let mockEncryptor: jest.Mocked<IEncryptor>;
  let mockSerializer: jest.Mocked<ITokenSerializer<TokenEncrypted>>;

  const fixedNow = new Date("2026-01-01T12:00:00.000Z");

  const validInput: ConnectServiceInput = {
    provider: ServiceProvider.GOOGLE,
    providerAccountId: "google-sub-123",
    email: "user@example.com",
    name: "Test User",
    accessToken: "access-token-123",
    refreshToken: "refresh-token-123",
    expiresIn: 3600,
    scopes: "openid email profile",
    metadata: { youtubeChannelId: "yt-123" },
    returnTo: "/settings",
    loggedUserId: "default-user-id",
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

    useCase = new ConnectServiceUseCase(
      mockUserRepository,
      mockServiceConnectionRepository,
      mockTokenManager,
      mockClock,
      mockEncryptor,
      mockSerializer,
    );
  });

  it("should connect a new service for logged user", async () => {
    const user = new UserBuilder().build();
    mockUserRepository.findByUserId.mockResolvedValue(user);
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

    expect(mockUserRepository.findByUserId).toHaveBeenCalledWith(user.id);
    expect(mockServiceConnectionRepository.createServiceConnection).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      token: "jwt-token-123",
      isPasswordSetupRequired: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      method: OAuthMethod.connect,
      returnTo: "/settings",
    });
  });

  it("should throw UnathorizedError when loggedUserId is missing", async () => {
    await expect(
      useCase.execute({ ...validInput, loggedUserId: undefined }),
    ).rejects.toThrow(new UnathorizedError(ERRORS.OAUTH_CONNECT_USER_INVALID));
  });

  it("should throw NotFoundError when logged user is not found", async () => {
    mockUserRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      new NotFoundError(ERRORS.OAUTH_CONNECT_USER_NOT_FOUND),
    );
  });

  it("should throw InvalidCredentialsError when service is already linked to another user", async () => {
    const user = new UserBuilder().build();
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

    mockUserRepository.findByUserId.mockResolvedValue(user);
    mockServiceConnectionRepository.findByServiceId.mockResolvedValue(otherUserConn);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      new InvalidCredentialsError(ERRORS.GOOGLE_ACCOUNT_ALREADY_LINKED),
    );
  });
});
