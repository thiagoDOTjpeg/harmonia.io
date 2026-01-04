import { IClock } from "@/application/ports/clock/IClock";
import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { ICodeExchanger } from "@/application/ports/oauth/ICodeExchanger";
import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { IOAuthCallbackStrategy } from "@/application/ports/strategy/IOAuthCallbackStrategy";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { User } from "@/domain/entities/User";
import { TokenEncrypted } from "@/types/encrypter";
import { GoogleOAuthResult } from "@/types/oauth/results";
import { OAuthState } from "@/types/oauth/state";
import { AppError, AuthResponse, InvalidCredentialsError, NotFoundError, OAuthMethod, ServiceProvider, UnathorizedError } from "@harmonia/shared";
import { Prisma, ServiceProvider as PrismaServiceProvider } from "@prisma/client";

const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

export class GoogleOAuthCallbackStrategy implements IOAuthCallbackStrategy {
  constructor(
    private readonly users: IUserRepository,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
    private readonly aesEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly google: ICodeExchanger<GoogleOAuthResult>,

  ) { }

  async processCallback(
    code: string,
    OAuthState: OAuthState,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    const exchangeData = await this.google.exchangeCode(code);;
    const { method, returnTo } = OAuthState;

    const expiresAt = new Date(
      this.clock.now().getTime() + Math.max(exchangeData.tokens.expires_in - 60, 0) * 1000
    );
    if (!exchangeData.profile.email || !exchangeData.profile.name) {
      throw new InvalidCredentialsError("Não foi possível obter/verificar o email/nome.")
    }
    const normalizedEmail = exchangeData.profile.email?.trim().toLowerCase();


    switch (method) {
      case OAuthMethod.register:
        return this.handleRegister(exchangeData, expiresAt, normalizedEmail, returnTo);

      case OAuthMethod.login:
        return this.handleLogin(exchangeData, expiresAt, normalizedEmail, returnTo);

      case OAuthMethod.connect:
        return this.handleConnect(exchangeData, expiresAt, normalizedEmail, returnTo, loggedUserId);
      default:
        throw new AppError("Metodo não suportado")
    }
  }

  private async handleRegister(
    exchangeData: GoogleOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string
  ): Promise<AuthResponse> {


    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      throw new InvalidCredentialsError("Já existe um usuário cadastrado com esses dados. Faça login e conecte o serviço")
    }
    const user = await this.users.createFromLocal({
      email: email,
      name: exchangeData?.profile?.name || "NoNameService",
    })

    const createdServiceConnection = await this.createServiceConnection(user, exchangeData, expiresAt)
    const jwt = this.tokens.sign({ sub: user.id });
    return {
      token: jwt,
      isPasswordSetupRequired: true,
      user: {
        id: createdServiceConnection.userId,
        email: createdServiceConnection.email,
        name: user.name
      },
      method: OAuthMethod.register,
      returnTo
    }
  }

  private async handleLogin(
    exchangeData: GoogleOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string
  ): Promise<AuthResponse> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new NotFoundError("Nenhum usuário encontrado, faça o registro")
    }

    let serviceConnection: ServiceConnection;
    const existingServiceConnection = await this.serviceConnection.findByServiceId(exchangeData.profile.sub)
    if (existingServiceConnection) {
      if (existingServiceConnection.userId !== user.id) {
        throw new InvalidCredentialsError("Esta conta Google já está vinculada.")
      }
      serviceConnection = await this.updateServiceConnection(user, exchangeData, expiresAt);
    } else {
      serviceConnection = await this.createServiceConnection(user, exchangeData, expiresAt);
    }

    const jwt = this.tokens.sign({ sub: user.id });
    return {
      token: jwt,
      isPasswordSetupRequired: false,
      user: {
        id: serviceConnection.userId,
        email: serviceConnection.email,
        name: user.name
      },
      method: OAuthMethod.login,
      returnTo
    }
  }

  private async handleConnect(
    exchangeData: GoogleOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    if (!loggedUserId) {
      throw new UnathorizedError("Usuário não identificado para conexão.")
    }
    const user = await this.users.findByUserId(loggedUserId);
    if (!user) {
      throw new NotFoundError("Nenhum usuário encontrado, conta do serviço diferente da cadastrada");
    }

    let serviceConnection: ServiceConnection;
    const existingServiceConnection = await this.serviceConnection.findByServiceId(exchangeData.profile.sub)

    if (existingServiceConnection) {
      if (existingServiceConnection.userId !== user.id) {
        throw new InvalidCredentialsError("Esta conta Google já está vinculada.")
      }
      serviceConnection = await this.updateServiceConnection(user, exchangeData, expiresAt);
    } else {
      serviceConnection = await this.createServiceConnection(user, exchangeData, expiresAt);
    }

    const jwt = this.tokens.sign({ sub: user.id });
    return {
      token: jwt,
      isPasswordSetupRequired: false,
      user: {
        id: serviceConnection.userId,
        email: serviceConnection.email,
        name: user.name
      },
      method: OAuthMethod.connect,
      returnTo
    }
  }

  private async createServiceConnection(user: User, exchangeData: GoogleOAuthResult, expiresAt: Date): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(exchangeData.tokens.access_token);
    const encryptedRefreshToken = exchangeData.tokens.refresh_token ? this.aesEncrypter.encrypt(exchangeData?.tokens?.refresh_token) : null

    const createdServiceConnection = await this.serviceConnection.createServiceConnection({
      userId: user?.id,
      providerAccountId: exchangeData.profile.sub,
      accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
      refreshToken: encryptedRefreshToken ? this.tokenSerializer.serialize(encryptedRefreshToken) : null,
      expiresAt,
      provider: ServiceProvider.GOOGLE as unknown as PrismaServiceProvider,
      scopes: SCOPES,
      email: user.email,
      metadata: {
        youtubeChannelId: exchangeData?.youtubeChannelId || ""
      }
    });
    return createdServiceConnection;
  }
  private async updateServiceConnection(user: User, exchangeData: GoogleOAuthResult, expiresAt: Date): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(exchangeData.tokens.access_token);
    const encryptedRefreshToken = exchangeData.tokens.refresh_token ? this.aesEncrypter.encrypt(exchangeData?.tokens?.refresh_token) : undefined

    const updatedServiceConnection = await this.serviceConnection.updateServiceConnection({
      accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
      refreshToken: encryptedRefreshToken ? this.tokenSerializer.serialize(encryptedRefreshToken) : Prisma.skip,
      expiresAt,
      updatedAt: new Date(),
      metadata: {
        youtubeChannelId: exchangeData.youtubeChannelId
      }
    }, exchangeData.profile.sub)
    return updatedServiceConnection;
  }
}