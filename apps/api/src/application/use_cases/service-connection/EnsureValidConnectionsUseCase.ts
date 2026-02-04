import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { logger } from "@/infrastructure/logger";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { ServiceProvider } from "@harmonia/shared";
import { Prisma } from "@prisma/client";

export class EnsureValidConnectionsUseCase {
  constructor(
    private readonly serviceConnectionRepository: IServiceConnectionRepository,
    private readonly AESEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly clock: IClock,
    private readonly providers: Record<ServiceProvider, IAuthProvider>
  ) { }

  public async execute(userId: string): Promise<Map<ServiceProvider, ServiceConnection>> {
    const serviceConnetions = new Map<ServiceProvider, ServiceConnection>();
    const existingConnections = await this.serviceConnectionRepository.findAllByUserId(userId);
    if (existingConnections == null) {
      throw new Error(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE)
    }
    await Promise.all(
      existingConnections.map(async (service) => {
        const authProvider = this.providers[service.provider];
        if (!authProvider) {
          throw new Error(ERRORS.SERVICE_CONNECTION_INVALID)
        }
        if (authProvider.isExpired(service)) {
          logger.debug({ service })
          const serializedRefreshToken = this.tokenSerializer.deserialize(service?.refreshToken);
          const refreshTokenDecrypted = this.AESEncrypter.decrypt(serializedRefreshToken.iv, serializedRefreshToken.cipherText, serializedRefreshToken.tag);

          const newTokens = await authProvider.refreshToken(refreshTokenDecrypted)
          const encryptedAccessToken = this.AESEncrypter.encrypt(newTokens.access_token);
          const encryptedRefreshToken = newTokens.refresh_token ? this.AESEncrypter.encrypt(newTokens?.refresh_token) : undefined
          const expiresAt = new Date(
            this.clock.now().getTime() + Math.max(newTokens.expires_in - 60, 0) * 1000
          );
          const savedServiceConnection = await this.serviceConnectionRepository.updateServiceConnection({
            accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
            refreshToken: encryptedRefreshToken ? this.tokenSerializer.serialize(encryptedRefreshToken) : Prisma.skip,
            expiresAt,
            updatedAt: new Date(),
          }, service.providerAccountId)
          serviceConnetions.set(service.provider, { ...savedServiceConnection, accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token });
        } else {
          const accessToken = this.decryptServiceConnectionToken(service.accessToken)
          const refreshToken = this.decryptServiceConnectionToken(service.refreshToken)
          serviceConnetions.set(service.provider, { ...service, accessToken, refreshToken })
        }
      })
    )
    return serviceConnetions;
  }

  private decryptServiceConnectionToken(encryptedToken?: string | null): string {
    const { cipherText, iv, tag } = this.tokenSerializer.deserialize(encryptedToken)
    const descriptedToken = this.AESEncrypter.decrypt(iv, cipherText, tag);
    return descriptedToken;
  }
}