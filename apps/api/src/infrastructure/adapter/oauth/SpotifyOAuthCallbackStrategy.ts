import { IClock } from "@/application/ports/clock/IClock";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { OAuthCallbackStrategy } from "@/application/ports/strategy/OAuthCallbackStrategy";
import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { User } from "@/domain/entities/User";
import { AuthResponse, OAuthMethod, OAuthState, ServiceProvider, SpotifyOAuthResult } from "@harmonia/shared";
import { ServiceProvider as PrismaServiceProvider } from "@prisma/client";

const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
].join(' ');

export class SpotifyOAuthCallbackStrategy implements OAuthCallbackStrategy<SpotifyOAuthResult> {
  constructor(
    private readonly users: IUserRepository,
    private readonly serviceConnection: IServiceConnectionRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
  ) {
  }
  async processCallback(
    exchangeData: SpotifyOAuthResult,
    state: OAuthState,
    loggedUserId?: string
  ): Promise<AuthResponse> {
    const { tokens, profile } = exchangeData;
    const { method, returnTo } = state;

    const expiresAt = new Date(
      this.clock.now().getTime() + Math.max(tokens.expires_in - 60, 0) * 1000
    );

    if (!profile.email || !profile.display_name) {
      return { success: false, error: "invalid_credentials", message: "Não foi possível obter/verificar o email/nome." }
    }

    const normalizedEmail = profile.email?.trim().toLowerCase();

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

    const createdServiceConnection = await this.serviceConnection.createServiceConnection({
      userId: user?.id,
      providerAccountId: exchangeData.profile.id,
      accessToken: exchangeData.tokens.access_token,
      refreshToken: exchangeData.tokens.refresh_token,
      expiresAt,
      provider: ServiceProvider.SPOTIFY as unknown as PrismaServiceProvider,
      scopes: SCOPES,
      email: user.email,
    });
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
    const createdServiceConnection = await this.serviceConnection.createServiceConnection({
      userId: user?.id,
      providerAccountId: exchangeData.profile.id,
      accessToken: exchangeData.tokens.access_token,
      refreshToken: exchangeData.tokens.refresh_token,
      expiresAt,
      provider: ServiceProvider.SPOTIFY as unknown as PrismaServiceProvider,
      scopes: SCOPES,
      email: user.email,
    });
    return createdServiceConnection;
  }
  private async updateServiceConnection(user: User, exchangeData: SpotifyOAuthResult, expiresAt: Date): Promise<ServiceConnection> {
    const updatedServiceConnection = await this.serviceConnection.updateServiceConnection({
      accessToken: exchangeData.tokens.access_token,
      refreshToken: exchangeData.tokens.refresh_token,
      expiresAt,
      updatedAt: new Date(),
    }, exchangeData.profile.id)
    return updatedServiceConnection;
  }
}