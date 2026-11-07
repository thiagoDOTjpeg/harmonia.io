import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ILogger } from "@/application/ports/logger/ILogger";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { RevokeServiceConnectionUseCase } from "@/application/use_cases/service-connection/RevokeServiceConnectionUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import {
  NotFoundError,
  ServiceProvider,
  UnathorizedError,
} from "@harmonia/shared";

describe("RevokeServiceConnectionUseCase", () => {
  let useCase: RevokeServiceConnectionUseCase;
  let mockRepository: jest.Mocked<IServiceConnectionRepository>;
  let mockEncryptor: jest.Mocked<IEncryptor>;
  let mockSerializer: jest.Mocked<ITokenSerializer<TokenEncrypted>>;
  let mockGoogleProvider: jest.Mocked<IAuthProvider>;
  let mockLogger: jest.Mocked<ILogger>;

  const createConnection = (
    provider: ServiceProvider,
    userId = "user-123",
  ): ServiceConnection =>
    new ServiceConnection(
      "conn-123",
      userId,
      provider,
      "provider-acc-123",
      "user@example.com",
      "serialized-access",
      new Date(),
      "scopes",
      null,
      new Date(),
      new Date(),
      "serialized-refresh",
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
      encrypt: jest.fn(),
      decrypt: jest.fn().mockReturnValue("decrypted-refresh-token"),
    };

    mockSerializer = {
      serialize: jest.fn(),
      deserialize: jest.fn().mockReturnValue({
        iv: "iv-123",
        cipherText: "cipher-123",
        tag: "tag-123",
      }),
    };

    mockGoogleProvider = {
      isExpired: jest.fn(),
      refreshToken: jest.fn(),
      revokeToken: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      child: jest.fn().mockReturnThis(),
    };

    useCase = new RevokeServiceConnectionUseCase(
      mockRepository,
      mockEncryptor,
      mockSerializer,
      mockGoogleProvider,
      mockLogger,
    );
  });

  it("should throw NotFoundError if service connection does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute("user-123", "conn-nonexistent")).rejects.toThrow(
      new NotFoundError(ERRORS.SERVICE_CONNECTION_NOT_FOUND),
    );

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw UnathorizedError if service connection belongs to another user", async () => {
    const connection = createConnection(ServiceProvider.GOOGLE, "other-user");
    mockRepository.findById.mockResolvedValue(connection);

    await expect(useCase.execute("user-123", "conn-123")).rejects.toThrow(
      new UnathorizedError(ERRORS.UNATHORIZED_OPERATION),
    );

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should revoke external token on Google provider and delete connection from repository", async () => {
    const googleConnection = createConnection(ServiceProvider.GOOGLE, "user-123");
    mockRepository.findById.mockResolvedValue(googleConnection);

    await useCase.execute("user-123", "conn-123");

    expect(mockSerializer.deserialize).toHaveBeenCalledWith(
      "serialized-refresh",
    );
    expect(mockEncryptor.decrypt).toHaveBeenCalledWith(
      "iv-123",
      "cipher-123",
      "tag-123",
    );
    expect(mockGoogleProvider.revokeToken).toHaveBeenCalledWith(
      "decrypted-refresh-token",
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(googleConnection);
  });

  it("should log a warning and still delete locally if Google external revokeToken fails", async () => {
    const googleConnection = createConnection(ServiceProvider.GOOGLE, "user-123");
    mockRepository.findById.mockResolvedValue(googleConnection);
    mockGoogleProvider.revokeToken.mockRejectedValue(
      new Error("Google API error"),
    );

    await useCase.execute("user-123", "conn-123");

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ serviceConnectionId: "conn-123" }),
      expect.stringContaining("Failed to revoke external Google token"),
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(googleConnection);
  });

  it("should delete Spotify connection directly without calling Google revokeToken", async () => {
    const spotifyConnection = createConnection(
      ServiceProvider.SPOTIFY,
      "user-123",
    );
    mockRepository.findById.mockResolvedValue(spotifyConnection);

    await useCase.execute("user-123", "conn-123");

    expect(mockGoogleProvider.revokeToken).not.toHaveBeenCalled();
    expect(mockRepository.delete).toHaveBeenCalledWith(spotifyConnection);
  });
});

