import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { EnsureValidConnectionsUseCase } from "@/application/use_cases/service-connection/EnsureValidConnectionsUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { ServiceProvider } from "@harmonia/shared";
import { Prisma } from "@prisma/client";

describe("EnsureValidConnectionsUseCase", () => {
  let useCase: EnsureValidConnectionsUseCase;
  let mockRepository: jest.Mocked<IServiceConnectionRepository>;
  let mockEncryptor: jest.Mocked<IEncryptor>;
  let mockSerializer: jest.Mocked<ITokenSerializer<TokenEncrypted>>;
  let mockClock: jest.Mocked<IClock>;
  let mockGoogleProvider: jest.Mocked<IAuthProvider>;
  let mockSpotifyProvider: jest.Mocked<IAuthProvider>;

  const fixedNow = new Date("2026-01-01T12:00:00.000Z");

  const createServiceConnection = (
    provider: ServiceProvider,
    overrides: Partial<ServiceConnection> = {},
  ): ServiceConnection =>
    new ServiceConnection(
      overrides.id ?? `conn-${provider}`,
      overrides.userId ?? "user-123",
      provider,
      overrides.providerAccountId ?? `acc-${provider}`,
      overrides.email ?? "user@example.com",
      overrides.accessToken ?? "serialized-access-token",
      overrides.expiresAt ?? new Date("2026-01-01T13:00:00.000Z"),
      overrides.scopes ?? "scope1 scope2",
      overrides.metadata ?? null,
      overrides.createdAt ?? fixedNow,
      overrides.updatedAt ?? fixedNow,
      overrides.refreshToken ?? "serialized-refresh-token",
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
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

    mockEncryptor = {
      encrypt: jest.fn().mockImplementation((val: string) => ({
        iv: "iv-b64",
        cipherText: `enc:${val}`,
        tag: "tag-b64",
      })),
      decrypt: jest
        .fn()
        .mockImplementation((_iv: string, cipherText: string) =>
          cipherText.replace("enc:", ""),
        ),
    };

    mockSerializer = {
      serialize: jest
        .fn()
        .mockImplementation((data: TokenEncrypted) => `ser:${data.cipherText}`),
      deserialize: jest.fn().mockImplementation((raw?: string | null) => ({
        iv: "iv-b64",
        cipherText: `enc:${raw}`,
        tag: "tag-b64",
      })),
    };

    mockClock = {
      now: jest.fn().mockReturnValue(fixedNow),
    };

    mockGoogleProvider = {
      isExpired: jest.fn(),
      refreshToken: jest.fn(),
      revokeToken: jest.fn(),
    };

    mockSpotifyProvider = {
      isExpired: jest.fn(),
      refreshToken: jest.fn(),
      revokeToken: jest.fn(),
    };

    useCase = new EnsureValidConnectionsUseCase(
      mockRepository,
      mockEncryptor,
      mockSerializer,
      mockClock,
      {
        [ServiceProvider.GOOGLE]: mockGoogleProvider,
        [ServiceProvider.SPOTIFY]: mockSpotifyProvider,
      },
    );
  });

  it("should throw SERVICE_CONNECTIONS_NOT_ACTIVE when repository returns null", async () => {
    mockRepository.findAllByUserId.mockResolvedValue(null);

    await expect(useCase.execute("user-123")).rejects.toThrow(
      ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE,
    );
  });

  it("should throw SERVICE_CONNECTION_INVALID when provider is not configured", async () => {
    const unknownConn = createServiceConnection(
      "unknown" as unknown as ServiceProvider,
    );
    mockRepository.findAllByUserId.mockResolvedValue([unknownConn]);

    await expect(useCase.execute("user-123")).rejects.toThrow(
      ERRORS.SERVICE_CONNECTION_INVALID,
    );
  });

  it("should decrypt and return active connections without refreshing when tokens are not expired", async () => {
    const googleConn = createServiceConnection(ServiceProvider.GOOGLE, {
      accessToken: "google-access",
      refreshToken: "google-refresh",
    });
    const spotifyConn = createServiceConnection(ServiceProvider.SPOTIFY, {
      accessToken: "spotify-access",
      refreshToken: "spotify-refresh",
    });

    mockRepository.findAllByUserId.mockResolvedValue([googleConn, spotifyConn]);
    mockGoogleProvider.isExpired.mockReturnValue(false);
    mockSpotifyProvider.isExpired.mockReturnValue(false);

    const result = await useCase.execute("user-123");

    expect(mockGoogleProvider.refreshToken).not.toHaveBeenCalled();
    expect(mockSpotifyProvider.refreshToken).not.toHaveBeenCalled();
    expect(mockRepository.updateServiceConnection).not.toHaveBeenCalled();

    expect(result.get(ServiceProvider.GOOGLE)).toMatchObject({
      accessToken: "google-access",
      refreshToken: "google-refresh",
    });
    expect(result.get(ServiceProvider.SPOTIFY)).toMatchObject({
      accessToken: "spotify-access",
      refreshToken: "spotify-refresh",
    });
  });

  it("should refresh expired token, persist new encrypted tokens, and return updated connection", async () => {
    const expiredGoogleConn = createServiceConnection(ServiceProvider.GOOGLE, {
      accessToken: "old-access",
      refreshToken: "old-refresh",
      providerAccountId: "google-acc-1",
    });

    mockRepository.findAllByUserId.mockResolvedValue([expiredGoogleConn]);
    mockGoogleProvider.isExpired.mockReturnValue(true);
    mockGoogleProvider.refreshToken.mockResolvedValue({
      access_token: "new-google-access",
      refresh_token: "new-google-refresh",
      expires_in: 3600,
      token_type: "Bearer",
      scope: "scope1",
    });

    mockRepository.updateServiceConnection.mockImplementation(
      async (data) =>
        new ServiceConnection(
          expiredGoogleConn.id,
          expiredGoogleConn.userId,
          expiredGoogleConn.provider,
          expiredGoogleConn.providerAccountId,
          expiredGoogleConn.email,
          data.accessToken as string,
          data.expiresAt as Date,
          expiredGoogleConn.scopes,
          expiredGoogleConn.metadata,
          expiredGoogleConn.createdAt,
          new Date(),
          data.refreshToken as string,
        ),
    );

    const result = await useCase.execute("user-123");

    expect(mockGoogleProvider.refreshToken).toHaveBeenCalledWith("old-refresh");
    expect(mockRepository.updateServiceConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "ser:enc:new-google-access",
        refreshToken: "ser:enc:new-google-refresh",
        expiresAt: new Date(fixedNow.getTime() + (3600 - 60) * 1000),
      }),
      "google-acc-1",
    );

    const updated = result.get(ServiceProvider.GOOGLE);
    expect(updated?.accessToken).toBe("new-google-access");
    expect(updated?.refreshToken).toBe("new-google-refresh");
  });

  it("should pass Prisma.skip for refreshToken when provider refresh does not return a new refresh_token", async () => {
    const expiredSpotifyConn = createServiceConnection(
      ServiceProvider.SPOTIFY,
      {
        accessToken: "old-spotify-access",
        refreshToken: "existing-spotify-refresh",
        providerAccountId: "spotify-acc-1",
      },
    );

    mockRepository.findAllByUserId.mockResolvedValue([expiredSpotifyConn]);
    mockSpotifyProvider.isExpired.mockReturnValue(true);
    mockSpotifyProvider.refreshToken.mockResolvedValue({
      access_token: "new-spotify-access",
      expires_in: 3600,
      token_type: "Bearer",
      scope: "scope1",
    });

    mockRepository.updateServiceConnection.mockResolvedValue(expiredSpotifyConn);

    await useCase.execute("user-123");

    expect(mockRepository.updateServiceConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "ser:enc:new-spotify-access",
        refreshToken: Prisma.skip,
      }),
      "spotify-acc-1",
    );
  });

  it("should propagate error when provider refreshToken fails", async () => {
    const expiredGoogleConn = createServiceConnection(ServiceProvider.GOOGLE);

    mockRepository.findAllByUserId.mockResolvedValue([expiredGoogleConn]);
    mockGoogleProvider.isExpired.mockReturnValue(true);
    mockGoogleProvider.refreshToken.mockRejectedValue(
      new Error("Invalid grant"),
    );

    await expect(useCase.execute("user-123")).rejects.toThrow("Invalid grant");
    expect(mockRepository.updateServiceConnection).not.toHaveBeenCalled();
  });
});

