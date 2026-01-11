import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ILogger } from "@/application/ports/logger/ILogger";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { NotFoundError, ServiceProvider, UnathorizedError } from "@harmonia/shared";

export class RevokeServiceConnectionUseCase {
  constructor(
    private readonly serviceConnectionRepository: IServiceConnectionRepository,
    private readonly aesEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly googleProvider: IAuthProvider,
    private readonly logger: ILogger
  ) { }

  async execute(userId: string, serviceConnectionId: string) {
    const serviceConnection = await this.serviceConnectionRepository.findById(serviceConnectionId);
    if (!serviceConnection) throw new NotFoundError(ERRORS.SERVICE_CONNECTION_NOT_FOUND);
    if (serviceConnection.userId !== userId) throw new UnathorizedError(ERRORS.UNATHORIZED_OPERATION)
    if (serviceConnection.provider === ServiceProvider.GOOGLE) {
      try {
        const { cipherText, iv, tag } = this.tokenSerializer.deserialize(serviceConnection.refreshToken)
        const decodedRefreshToken = this.aesEncrypter.decrypt(iv, cipherText, tag);
        await this.googleProvider.revokeToken(decodedRefreshToken);
      } catch (error) {
        this.logger.warn({ err: error, serviceConnectionId }, 'Failed to revoke external Google token, proceeding with local delete');
      }
    }
    await this.serviceConnectionRepository.delete(serviceConnection);
  }
}