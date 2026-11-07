import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { User } from "@/domain/entities/User";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";
import { OAuthNormalizedData } from "@/types/oauth/callback";
import {
  AuthResponse,
  InvalidCredentialsError,
  NotFoundError,
  OAuthMethod,
  ServiceProvider,
} from "@harmonia/shared";
import { Prisma, ServiceProvider as PrismaServiceProvider } from "@prisma/client";

export class LoginWithOAuthUseCase {
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

    const user = await this.users.findByEmail(normalizedEmail);
    if (!user) {
      throw new NotFoundError(ERRORS.OAUTH_USER_NOT_FOUND);
    }

    const expiresAt = new Date(
      this.clock.now().getTime() + Math.max(input.expiresIn - 60, 0) * 1000,
    );

    let serviceConnection: ServiceConnection;
    const existingServiceConnection =
      await this.serviceConnection.findByServiceId(input.providerAccountId);

    if (existingServiceConnection) {
      if (existingServiceConnection.userId !== user.id) {
        const alreadyLinkedError =
          input.provider === ServiceProvider.SPOTIFY
            ? ERRORS.SPOTIFY_ACCOUNT_ALREADY_LINKED
            : ERRORS.GOOGLE_ACCOUNT_ALREADY_LINKED;
        throw new InvalidCredentialsError(alreadyLinkedError);
      }
      serviceConnection = await this.updateServiceConnection(input, expiresAt);
    } else {
      serviceConnection = await this.createServiceConnection(
        user,
        input,
        expiresAt,
      );
    }

    const jwt = this.tokens.sign({ sub: user.id });

    return {
      token: jwt,
      isPasswordSetupRequired: false,
      user: {
        id: serviceConnection.userId,
        email: serviceConnection.email,
        name: user.name,
      },
      method: OAuthMethod.login,
      returnTo: input.returnTo,
    };
  }

  private async createServiceConnection(
    user: User,
    input: OAuthNormalizedData,
    expiresAt: Date,
  ): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(input.accessToken);
    const encryptedRefreshToken = input.refreshToken
      ? this.aesEncrypter.encrypt(input.refreshToken)
      : null;

    return this.serviceConnection.createServiceConnection({
      userId: user.id,
      providerAccountId: input.providerAccountId,
      accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
      refreshToken: encryptedRefreshToken
        ? this.tokenSerializer.serialize(encryptedRefreshToken)
        : null,
      expiresAt,
      provider: input.provider as unknown as PrismaServiceProvider,
      scopes: input.scopes,
      email: user.email,
      ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
    });
  }

  private async updateServiceConnection(
    input: OAuthNormalizedData,
    expiresAt: Date,
  ): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(input.accessToken);
    const encryptedRefreshToken = input.refreshToken
      ? this.aesEncrypter.encrypt(input.refreshToken)
      : undefined;

    return this.serviceConnection.updateServiceConnection(
      {
        accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
        refreshToken: encryptedRefreshToken
          ? this.tokenSerializer.serialize(encryptedRefreshToken)
          : Prisma.skip,
        expiresAt,
        updatedAt: new Date(),
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      },
      input.providerAccountId,
    );
  }
}

