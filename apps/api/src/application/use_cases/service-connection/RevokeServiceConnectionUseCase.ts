import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { TokenEncrypted } from "@/infrastructure/http/types/encrypter";
import { NotFoundError, ServiceProvider, UnathorizedError } from "@harmonia/shared";

export class RevokeServiceConnectionUseCase {
  constructor(
    private readonly serviceConnectionRepository: IServiceConnectionRepository,
    private readonly aesEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly googleProvider: IAuthProvider
  ) { }

  async execute(userId: string, serviceConnectionId: string) {
    const serviceConnection = await this.serviceConnectionRepository.findById(serviceConnectionId);
    if (!serviceConnection) throw new NotFoundError("Conexão não encontrada");
    if (serviceConnection.userId !== userId) throw new UnathorizedError("Operação não permitida")
    if (serviceConnection.provider === ServiceProvider.GOOGLE) {
      try {
        const { cipherText, iv, tag } = this.tokenSerializer.deserialize(serviceConnection.refreshToken)
        const decodedRefreshToken = this.aesEncrypter.decrypt(iv, cipherText, tag);
        await this.googleProvider.revokeToken(decodedRefreshToken);
      } catch (error) {
        console.error("Falha ao revogar token externo do Google, mas prosseguindo com delete local:", error);
      }
    }
    await this.serviceConnectionRepository.delete(serviceConnection);
  }
}