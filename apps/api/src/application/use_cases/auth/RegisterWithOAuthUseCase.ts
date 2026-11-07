import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { User } from "@/domain/entities/User";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import { AuthResponse, InvalidCredentialsError, OAuthMethod } from "@harmonia/shared";
import { ServiceProvider as PrismaServiceProvider } from "@prisma/client";

export class RegisterWithOAuthUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
    private readonly aesEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
  ) {}

  async execute(input: OAuthNormalizedData): Promise<AuthResponse> {
    if (!input.email || !input.name) {
      throw new InvalidCredentialsError(ERRORS.OAUTH_INVALID_CREDENTIALS);
    }

    const normalizedEmail = input.email.trim().toLowerCase();

    const existingUser = await this.users.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new InvalidCredentialsError(ERRORS.OAUTH_USER_ALREADY_EXISTIS);
    }

    const persistUser = User.create({
      email: input.email,
      name: input.name,
      passwordHash: null,
    });

    const savedUser = await this.users.save(persistUser);

    const expiresAt = new Date(
      this.clock.now().getTime() + Math.max(input.expiresIn - 60, 0) * 1000,
    );

    const encryptedAccessToken = this.aesEncrypter.encrypt(input.accessToken);
    const encryptedRefreshToken = input.refreshToken
      ? this.aesEncrypter.encrypt(input.refreshToken)
      : null;

    const createdServiceConnection =
      await this.serviceConnection.createServiceConnection({
        userId: savedUser.id,
        providerAccountId: input.providerAccountId,
        accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
        refreshToken: encryptedRefreshToken
          ? this.tokenSerializer.serialize(encryptedRefreshToken)
          : null,
        expiresAt,
        provider: input.provider as unknown as PrismaServiceProvider,
        scopes: input.scopes,
        email: savedUser.email,
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      });

    const jwt = this.tokens.sign({ sub: savedUser.id });

    return {
      token: jwt,
      isPasswordSetupRequired: true,
      user: {
        id: createdServiceConnection.userId,
        email: createdServiceConnection.email,
        name: savedUser.name,
      },
      method: OAuthMethod.register,
      returnTo: input.returnTo,
    };
  }
}

