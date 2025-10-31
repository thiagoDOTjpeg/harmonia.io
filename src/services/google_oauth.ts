import { Request, Response } from 'express';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');


const googleStateStore = new Set<string>();

const google_oauth = class google_oauth {
  static async login(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    googleStateStore.add(state);

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      response_type: 'code',
      redirect_uri: GOOGLE_REDIRECT_URI,
      scope: GOOGLE_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  static async callback(req: Request, res: Response) {
    try {
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;

      if (!code || !state || !googleStateStore.has(state)) {
        return res.status(400).json({ error: 'invalid_state_or_code' });
      }
      googleStateStore.delete(state);

      // Troca code por tokens
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
      });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!tokenRes.ok) {
        return res.status(400).json({ error: 'token_exchange_failed', details: await tokenRes.text() });
      }

      const tokenJson = await tokenRes.json() as {
        access_token: string;
        refresh_token?: string;
        expires_in: number;
        id_token?: string;
        scope: string;
        token_type: string;
      };

      // Info do usuário (OpenID)
      const uRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (!uRes.ok) {
        return res.status(400).json({ error: 'userinfo_failed', details: await uRes.text() });
      }
      const u = await uRes.json() as {
        sub: string;       // google user id
        email?: string;
        name?: string;
        picture?: string;
      };

      // Opcional: pegar canal do YouTube
      let youtubeChannelId: string | undefined;
      const ytRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (ytRes.ok) {
        const yt = await ytRes.json() as { items?: Array<{ id: string }> };
        youtubeChannelId = yt.items?.[0]?.id;
      }

      // Upsert de usuário
      const user = await prisma.user.upsert({
        where: { googleId: u.sub },
        update: {
          email: u.email ?? undefined,
          name: u.name ?? undefined,
          googleAccessToken: tokenJson.access_token,
          googleRefreshToken: tokenJson.refresh_token ?? undefined,
          googleTokenExpiry: new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000),
          youtubeChannelId: youtubeChannelId ?? undefined,
        },
        create: {
          email: (u.email ?? `google_${u.sub}@users.local`).toLowerCase(),
          name: u.name ?? null,
          googleId: u.sub,
          googleAccessToken: tokenJson.access_token,
          googleRefreshToken: tokenJson.refresh_token ?? null,
          googleTokenExpiry: new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000),
          youtubeChannelId: youtubeChannelId ?? null,
        },
      });

      const jwt = signToken({ sub: user.id });
      res.json({
        token: jwt,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          youtubeChannelId: user.youtubeChannelId,
        },
      });
    } catch {
      res.status(500).json({ error: 'auth_failed' });
    }
  }
}

export default google_oauth;