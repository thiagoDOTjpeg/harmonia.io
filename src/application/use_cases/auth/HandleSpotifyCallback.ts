import { AuthResponse } from "../../../shared/types/oauth/oauth";
import { IClock } from "../../ports/clock/IClock";
import { ITokenManager } from "../../ports/crypto/ITokenManager";
import { IOAuthStateStore } from "../../ports/oauth/IOAuthStateStore";
import { ISpotifyOAuthClient } from "../../ports/oauth/ISpotifyOAuthClient";
import { IUserRepository } from "../../repositories/IUserRepository";

export class HandleSpotifyCallback {
  constructor(
    private readonly stateStore: IOAuthStateStore,
    private readonly spotify: ISpotifyOAuthClient,
    private readonly users: IUserRepository,
    private readonly tokens: ITokenManager,
    private readonly clock: IClock,
  ) { }

  async execute(input: { code: string; state: string }): Promise<AuthResponse> {
    const stateData = this.stateStore.get(input.state);
    if (!stateData) return { error: "invalid_state_or_code" }
    this.stateStore.delete(input.state);
    const { mode, returnTo } = stateData;

    const { tokens, profile } = await this.spotify.exchangeCode(input.code);
    const expiresAt = new Date(this.clock.now().getTime() + Math.max(tokens.expires_in - 60, 0) * 1000);
    const normalizedEmail = profile.email ? profile.email.trim().toLowerCase() : undefined;

    const bySpotify = await this.users.findBySpotifyId(profile.id);
    if (bySpotify) {
      const updated = await this.users.updateSpotifyTokens(bySpotify.id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? bySpotify.spotifyRefreshToken ?? null,
        tokenExpiry: expiresAt
      })
      const jwt = this.tokens.sign({ sub: updated.id });
      return {
        token: jwt, user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          googleId: updated.googleId,
          spotifyId: updated.spotifyId,
          youtubeChannelId: updated.youtubeChannelId
        }, returnTo
      };
    }

    if (mode === "register") {
      if (!normalizedEmail) return { error: "email_ambiguous", message: "Não foi possível obter/verificar o email." }

      const existing = await this.users.findByEmail(normalizedEmail);
      if (existing) return { error: "email_in_use", message: "Já existe uma conta com este email. Faça login e conecte o Spotify" }

      const created = await this.users.createFromSpotify({
        email: normalizedEmail,
        name: profile.display_name ?? null,
        spotifyId: profile.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        tokenExpiry: expiresAt,
      });

      const jwt = this.tokens.sign({ sub: created.id });
      return {
        token: jwt, user: {
          id: created.id,
          email: created.email,
          name: created.name,
          googleId: created.googleId,
          spotifyId: created.spotifyId,
          youtubeChannelId: created.youtubeChannelId
        }, returnTo
      };
    }

    if (normalizedEmail) {
      const userByEmail = await this.users.findByEmail(normalizedEmail);
      if (!userByEmail) return { error: "no_account", message: "Conta não encontrada. Crie uma conta com Spotify" }

      const updated = await this.users.linkToSpotifyToUser(userByEmail.id, {
        spotifyId: profile.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? userByEmail.spotifyRefreshToken ?? null,
        tokenExpiry: expiresAt,
      })
      const jwt = this.tokens.sign({ sub: updated.id });
      return {
        token: jwt, user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          googleId: updated.googleId,
          spotifyId: updated.spotifyId,
          youtubeChannelId: updated.youtubeChannelId
        }, returnTo
      };
    }
    return { error: "require_manual_link", message: "Email não verificado ou ausente. Conecte manualmente após o login" };
  }
}