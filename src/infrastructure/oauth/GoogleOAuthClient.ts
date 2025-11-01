import { IGoogleOAuthClient } from '../../application/ports/oauth/IGoogleOAuthClient';
import { GoogleTokenResponse, GoogleUserInfo } from '../../legacy/types';
import { GoogleExchangeResult } from '../../shared/types/oauth/google';

export class GoogleOAuthClient implements IGoogleOAuthClient {
  constructor(
    private readonly clientId = process.env.GOOGLE_CLIENT_ID!,
    private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET!,
    private readonly redirectUri = process.env.GOOGLE_REDIRECT_URI!,
  ) { }

  buildAuthUrl(state: string): string {
    const scopes = [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/youtube.readonly',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<GoogleExchangeResult> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!tokenRes.ok) {
      throw Object.assign(new Error('token_exchange_failed'), { code: 'token_exchange_failed', details: await tokenRes.text() });
    }
    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    const uRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!uRes.ok) {
      throw Object.assign(new Error('userinfo_failed'), { code: 'userinfo_failed', details: await uRes.text() });
    }
    const profile = (await uRes.json()) as GoogleUserInfo;

    // Opcional: YouTube channel
    let youtubeChannelId: string | undefined;
    const ytRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (ytRes.ok) {
      const yt = (await ytRes.json()) as { items?: Array<{ id: string }> };
      youtubeChannelId = yt.items?.[0]?.id;
    }

    return { tokens, profile, youtubeChannelId };
  }
}