import { Request, Response } from 'express';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { GoogleTokenResponse, GoogleUserInfo, OAuthState } from '../types';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');


const googleStateStore = new Map<string, OAuthState>();

const buildAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const google_oauth = class google_oauth {
  static async startLogin(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined;
    googleStateStore.set(state, { mode: 'login', returnTo });
    res.redirect(buildAuthUrl(state));
  }

  static async startRegister(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined;
    googleStateStore.set(state, { mode: 'register', returnTo });
    res.redirect(buildAuthUrl(state));
  }

  static async callback(req: Request, res: Response) {
    try {
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;
      if (!code || !state) return res.status(400).json({ error: 'invalid_state_or_code' });
      const stateData = googleStateStore.get(state);
      if (!stateData) return res.status(400).json({ error: 'invalid_state_or_code' });
      googleStateStore.delete(state);
      const { mode, returnTo } = stateData;

      // Troca code por tokens
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!tokenRes.ok) {
        return res.status(400).json({ error: 'token_exchange_failed', details: await tokenRes.text() });
      }

      const tokenJson = (await tokenRes.json()) as GoogleTokenResponse

      // Userinfo (OpenID)
      const uRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (!uRes.ok) {
        return res.status(400).json({ error: 'userinfo_failed', details: await uRes.text() });
      }
      const u = (await uRes.json()) as GoogleUserInfo

      // Opcional: pegar canal do YouTube
      let youtubeChannelId: string | undefined;
      const ytRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (ytRes.ok) {
        const yt = (await ytRes.json()) as { items?: Array<{ id: string }> };
        youtubeChannelId = yt.items?.[0]?.id;
      }

      const expiresAt = new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000);
      const normalizedEmail = u.email ? u.email.trim().toLowerCase() : undefined;
      const emailVerified = Boolean(u.email_verified);

      // 1) Se já existe por googleId, atualiza tokens e autentica
      const byGoogle = await prisma.user.findUnique({ where: { googleId: u.sub } });
      if (byGoogle) {
        const updated = await prisma.user.update({
          where: { id: byGoogle.id },
          data: {
            googleAccessToken: tokenJson.access_token,
            googleRefreshToken: tokenJson.refresh_token ?? byGoogle.googleRefreshToken,
            googleTokenExpiry: expiresAt,
            youtubeChannelId: youtubeChannelId ?? undefined,
          },
        });
        const jwt = signToken({ sub: updated.id });
        return res.json({ token: jwt, user: { id: updated.id, email: updated.email, name: updated.name, googleId: updated.googleId, youtubeChannelId: updated.youtubeChannelId }, returnTo });
      }

      if (mode === 'register') {
        // Registro com OAuth: bloqueia se email já em uso
        if (!normalizedEmail) {
          return res.status(409).json({ error: 'email_ambiguous', message: 'Não foi possível obter/verificar o email.' });
        }
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
          return res.status(409).json({ error: 'email_in_use', message: 'Já existe uma conta com este email. Faça login e conecte o Google nas configurações.' });
        }
        const created = await prisma.user.create({
          data: {
            email: normalizedEmail ?? `google_${u.sub}@users.local`,
            name: u.name ?? null,
            googleId: u.sub,
            googleAccessToken: tokenJson.access_token,
            googleRefreshToken: tokenJson.refresh_token ?? null,
            googleTokenExpiry: expiresAt,
            youtubeChannelId: youtubeChannelId ?? null,
          },
        });
        const jwt = signToken({ sub: created.id });
        return res.status(201).json({ token: jwt, user: { id: created.id, email: created.email, name: created.name, googleId: created.googleId, youtubeChannelId: created.youtubeChannelId }, returnTo });
      }

      // mode === 'login' → link automático por email verificado
      if (normalizedEmail && emailVerified) {
        const userByEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!userByEmail) {
          return res.status(404).json({ error: 'no_account', message: 'Conta não encontrada. Crie uma conta com Google.' });
        }
        const updated = await prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            googleId: u.sub,
            googleAccessToken: tokenJson.access_token,
            googleRefreshToken: tokenJson.refresh_token ?? userByEmail.googleRefreshToken,
            googleTokenExpiry: expiresAt,
            youtubeChannelId: youtubeChannelId ?? undefined,
          },
        });
        const jwt = signToken({ sub: updated.id });
        return res.json({ token: jwt, user: { id: updated.id, email: updated.email, name: updated.name, googleId: updated.googleId, youtubeChannelId: updated.youtubeChannelId }, returnTo });
      }

      return res.status(409).json({ error: 'require_manual_link', message: 'Email não verificado ou ausente. Conecte manualmente após login.' });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        return res.status(409).json({ error: 'conflict', message: 'Conflito de vínculo de conta.' });
      }
      return res.status(500).json({ error: 'auth_failed' });
    }
  }
}

export default google_oauth;