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
import { TokenEncrypted } from "@/infrastructure/http/types/encrypter";
import { AuthResponse, OAuthMethod, OAuthState, ServiceProvider, SpotifyOAuthResult } from "@harmonia/shared";
import { Prisma, ServiceProvider as PrismaServiceProvider } from "@prisma/client";

const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
].join(' ');

export class SpotifyOAuthCallbackStrategy implements IOAuthCallbackStrategy {
  constructor(
    private readonly users: IUserRepository,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
    private readonly aesEncrypter: IEncryptor,
    private readonly tokenSerializer: ITokenSerializer<TokenEncrypted>,
    private readonly spotify: ICodeExchanger<SpotifyOAuthResult>,

  ) {
  }
  async processCallback(
    state: OAuthState,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    const exchangeData = await this.spotify.exchangeCode(state.code);
    const { method, returnTo } = state;

    const expiresAt = new Date(
      this.clock.now().getTime() + Math.max(exchangeData.tokens.expires_in - 60, 0) * 1000
    );

    if (!exchangeData.profile.email || !exchangeData.profile.display_name) {
      return { success: false, error: "invalid_credentials", message: "Não foi possível obter/verificar o email/nome." }
    }

    const normalizedEmail = exchangeData.profile.email?.trim().toLowerCase();

    switch (method) {
      case OAuthMethod.register:
        return this.handleRegister(exchangeData, expiresAt, normalizedEmail, returnTo)
      case OAuthMethod.login:
        return this.handleLogin(exchangeData, expiresAt, normalizedEmail, returnTo)
      case OAuthMethod.connect:
        return this.handleConnect(exchangeData, expiresAt, normalizedEmail, returnTo, loggedUserId)
    }
  }

  private async handleRegister(
    exchangeData: SpotifyOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string
  ): Promise<AuthResponse> {

    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      return { success: false, error: 'email_in_use', message: 'Já existe um usuário cadastrado com esses dados. Faça login e conecte o serviço' };
    }

    const user = await this.users.createFromLocal({
      email: email,
      name: exchangeData?.profile?.display_name || "NoNameService",
    })

    const createdServiceConnection = await this.createServiceConnection(user, exchangeData, expiresAt);
    const jwt = this.tokens.sign({ sub: user.id });
    return {
      success: true,
      token: jwt,
      user: {
        id: createdServiceConnection.userId,
        email: createdServiceConnection.email,
        name: user.name
      }, returnTo
    }
  }

  private async handleLogin(
    exchangeData: SpotifyOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string
  ): Promise<AuthResponse> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      return { success: false, error: 'no_account', message: "Nenhum usuário encontrado, faça o registro" };
    }

    let serviceConnection: ServiceConnection;
    const existingServiceConnection = await this.serviceConnection.findByServiceId(exchangeData.profile.id)
    if (existingServiceConnection) {
      if (existingServiceConnection.userId !== user.id) {
        return { success: false, error: 'conflict', message: "Esta conta Spotify já está conectada a outro usuário." };
      }
      serviceConnection = await this.updateServiceConnection(user, exchangeData, expiresAt);
    } else {
      serviceConnection = await this.createServiceConnection(user, exchangeData, expiresAt);
    }

    const jwt = this.tokens.sign({ sub: user.id });
    return {
      success: true,
      token: jwt,
      user: {
        id: serviceConnection.userId,
        email: serviceConnection.email,
        name: user.name
      }, returnTo
    }
  }

  private async handleConnect(
    exchangeData: SpotifyOAuthResult,
    expiresAt: Date,
    email: string,
    returnTo?: string,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    if (!loggedUserId) {
      return { success: false, error: 'unauthorized', message: "Usuário não identificado para conexão." };
    }
    const user = await this.users.findByUserId(loggedUserId);
    if (!user) {
      return { success: false, error: 'no_account', message: "Nenhum usuário encontrado, conta do serviço diferente da cadastrada" };
    }

    let serviceConnection: ServiceConnection;
    const existingServiceConnection = await this.serviceConnection.findByServiceId(exchangeData.profile.id)

    if (existingServiceConnection) {
      if (existingServiceConnection.userId !== user.id) {
        return { success: false, error: 'conflict', message: "Esta conta Spotify já está conectada a outro usuário." };
      }
      serviceConnection = await this.updateServiceConnection(user, exchangeData, expiresAt);
    } else {
      serviceConnection = await this.createServiceConnection(user, exchangeData, expiresAt);
    }
    const jwt = this.tokens.sign({ sub: user.id });
    return {
      success: true,
      token: jwt,
      user: {
        id: serviceConnection.userId,
        email: serviceConnection.email,
        name: user.name
      }, returnTo
    }
  }

  private async createServiceConnection(user: User, exchangeData: SpotifyOAuthResult, expiresAt: Date): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(exchangeData.tokens.access_token);
    const encryptedRefreshToken = exchangeData.tokens.refresh_token ? this.aesEncrypter.encrypt(exchangeData?.tokens?.refresh_token) : null

    const createdServiceConnection = await this.serviceConnection.createServiceConnection({
      userId: user?.id,
      providerAccountId: exchangeData.profile.id,
      accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
      refreshToken: encryptedRefreshToken ? this.tokenSerializer.serialize(encryptedRefreshToken) : null,
      accessTokenIv: encryptedAccessToken.iv,
      refreshTokenIv: encryptedRefreshToken ? encryptedRefreshToken.iv : null,
      expiresAt,
      provider: ServiceProvider.SPOTIFY as unknown as PrismaServiceProvider,
      scopes: SCOPES,
      email: user.email,
    });
    return createdServiceConnection;
  }
  private async updateServiceConnection(user: User, exchangeData: SpotifyOAuthResult, expiresAt: Date): Promise<ServiceConnection> {
    const encryptedAccessToken = this.aesEncrypter.encrypt(exchangeData.tokens.access_token);
    const encryptedRefreshToken = exchangeData.tokens.refresh_token ? this.aesEncrypter.encrypt(exchangeData?.tokens?.refresh_token) : undefined

    const updatedServiceConnection = await this.serviceConnection.updateServiceConnection({
      accessToken: this.tokenSerializer.serialize(encryptedAccessToken),
      refreshToken: encryptedRefreshToken ? this.tokenSerializer.serialize(encryptedRefreshToken) : Prisma.skip,
      accessTokenIv: encryptedAccessToken.iv,
      refreshTokenIv: encryptedRefreshToken ? encryptedRefreshToken.iv : Prisma.skip,
      expiresAt,
      updatedAt: new Date(),
    }, exchangeData.profile.id)
    return updatedServiceConnection;
  }
}