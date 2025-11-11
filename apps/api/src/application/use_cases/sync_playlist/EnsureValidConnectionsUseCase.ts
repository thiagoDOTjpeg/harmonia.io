import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { TokenEncrypted } from "@/infrastructure/http/types/encrypter";
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
    const serviceConnetions: Map<ServiceProvider, ServiceConnection> = new Map();
    const existingConnections = await this.serviceConnectionRepository.findAllByUserId(userId);
    if (existingConnections == null) {
      throw new Error("Conexão com serviços necessários não estão ativas")
    }
    await Promise.all(
      existingConnections.map(async (service) => {
        const authProvider = this.providers[service.provider];
        if (!authProvider) {
          throw new Error("Serviço de conexão não identificado")
        }
        if (authProvider.isExpired(service)) {
          console.log("cheguei aqui");
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
            accessTokenIv: encryptedAccessToken.iv,
            refreshTokenIv: encryptedRefreshToken ? encryptedRefreshToken.iv : Prisma.skip,
            expiresAt,
            updatedAt: new Date(),
          }, service.providerAccountId)
          serviceConnetions.set(service.provider, savedServiceConnection);
        } else {
          serviceConnetions.set(service.provider, service)
        }
      })
    )
    return serviceConnetions;
  }
}