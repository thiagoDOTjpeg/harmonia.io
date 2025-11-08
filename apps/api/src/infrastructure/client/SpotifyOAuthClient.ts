import { SpotifyOAuthProfile, SpotifyOAuthResult, SpotifyTokenResponse } from '@harmonia/shared';
import { ISpotifyOAuthClient } from "../../application/ports/oauth/ISpotifyOAuthClient";

export class SpotifyOAuthClient implements ISpotifyOAuthClient {
  constructor(
    private readonly clientId = process.env.SPOTIFY_CLIENT_ID!,
    private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET!,
    private readonly redirectUri = process.env.SPOTIFY_REDIRECT_URI!,
  ) { }
  buildAuthUrl(state: string): string {
    const scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-private',
      'playlist-modify-public',
      'user-read-email',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes,
      state,
    })
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
  async exchangeCode(code: string): Promise<SpotifyOAuthResult> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    })
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    })
    if (!tokenRes.ok) {
      throw Object.assign(new Error('token_exchange_failed'), { code: 'token_exchange_failed', details: await tokenRes.text() });
    }
    const tokens = (await tokenRes.json()) as SpotifyTokenResponse;

    const meSpotify = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!meSpotify.ok) {
      throw Object.assign(new Error('userinfo_failed'), { code: 'userinfo_failed', details: await meSpotify.text() });
    }

    const profile = (await meSpotify.json()) as SpotifyOAuthProfile

    return { tokens, profile }
  }
}