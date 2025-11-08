import { AuthResponse, OAuthCallbackData, OAuthMethod } from '@harmonia/shared';
import { IClock } from '../../ports/clock/IClock';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IGoogleOAuthClient } from '../../ports/oauth/IGoogleOAuthClient';
import { IOAuthStateStore } from '../../ports/oauth/IOAuthStateStore';
import { IUserRepository } from '../../repositories/IUserRepository';

export class HandleGoogleCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly google: IGoogleOAuthClient,
    private readonly users: IUserRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
  ) { }

  async execute(input: OAuthCallbackData): Promise<AuthResponse> {
    const stateData = await this.stateStore.get(input.state);
    if (!stateData) return { success: false, error: 'invalid_state_or_code' };
    this.stateStore.delete(input.state);
    const { method, returnTo } = stateData;

    const { tokens, profile, youtubeChannelId } = await this.google.exchangeCode(input.code);
    const expiresAt = new Date(this.clock.now().getTime() + Math.max(tokens.expires_in - 60, 0) * 1000);
    const normalizedEmail = profile.email ? profile.email.trim().toLowerCase() : "";
    const emailVerified = Boolean(profile.email_verified);

    const byGoogle = await this.users.findByEmail(normalizedEmail);
    if (byGoogle) {
      const updated = await this.users.updateGoogleTokens(byGoogle.id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? byGoogle.googleRefreshToken ?? null,
        tokenExpiry: expiresAt,
        youtubeChannelId: youtubeChannelId ?? byGoogle.youtubeChannelId ?? null,
      });
      const jwt = this.tokens.sign({ sub: updated.id });
      return {
        success: true,
        token: jwt, user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
        }, returnTo
      };
    }

    if (method == OAuthMethod.register) {
      if (!normalizedEmail) {
        return { success: false, error: 'email_ambiguous', message: 'Não foi possível obter/verificar o email.' };
      }
      const existing = await this.users.findByEmail(normalizedEmail);
      if (existing) {
        return { success: false, error: 'email_in_use', message: 'Já existe uma conta com este email. Faça login e conecte o Google.' };
      }
      const created = await this.users.createFromGoogle({
        email: normalizedEmail,
        name: profile.name ?? null,
        googleId: profile.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        tokenExpiry: expiresAt,
        youtubeChannelId: youtubeChannelId ?? null,
      });
      const jwt = this.tokens.sign({ sub: created.id });
      return {
        success: true,
        token: jwt, user
          : {
          id: created.id,
          email: created.email,
          name: created.name,
        }, returnTo
      };
    }

    // mode === 'login'
    if (normalizedEmail && emailVerified) {
      const userByEmail = await this.users.findByEmail(normalizedEmail);
      if (!userByEmail) {
        return { success: false, error: 'no_account', message: 'Conta não encontrada. Crie uma conta com Google.' };
      }
      const updated = await this.users.linkGoogleToUser(userByEmail.id, {
        googleId: profile.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? userByEmail.googleRefreshToken ?? null,
        tokenExpiry: expiresAt,
        youtubeChannelId: youtubeChannelId ?? userByEmail.youtubeChannelId ?? null,
      });
      const jwt = this.tokens.sign({ sub: updated.id });
      return {
        success: true,
        token: jwt, user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
        }, returnTo
      };
    }

    return { success: false, error: 'require_manual_link', message: 'Email não verificado ou ausente. Conecte manualmente após login.' };
  }
}