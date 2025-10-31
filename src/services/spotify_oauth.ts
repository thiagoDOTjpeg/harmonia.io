import { Request, Response } from 'express';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
].join(' ');

const spotifyStore = new Set<string>();


const spotify_oauth = class spotify_oauth {
  static async login(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    spotifyStore.add(state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      state,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  }

  static async callback(req: Request, res: Response) {
    try {
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;

      if (!code || !state || !spotifyStore.has(state)) {
        return res.status(400).json({ error: 'invalid_state_or_code' });
      }
      spotifyStore.delete(state);

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      });

      const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!tokenRes.ok) {
        return res.status(400).json({ error: 'token_exchange_failed', details: await tokenRes.text() });
      }

      const tokenJson = await tokenRes.json() as {
        access_token: string;
        refresh_token?: string;
        expires_in: number;
      };

      const meRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (!meRes.ok) {
        return res.status(400).json({ error: 'me_fetch_failed', details: await meRes.text() });
      }
      const me = await meRes.json() as { id: string; email?: string | null; display_name?: string | null };

      const user = await prisma.user.upsert({
        where: { spotifyId: me.id },
        update: {
          email: me.email ?? undefined,
          name: me.display_name ?? undefined,
          spotifyAccessToken: tokenJson.access_token,
          spotifyRefreshToken: tokenJson.refresh_token ?? undefined,
          spotifyTokenExpiry: new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000),
        },
        create: {
          email: me.email ?? `spotify_${me.id}@users.local`,
          name: me.display_name ?? null,
          spotifyId: me.id,
          spotifyAccessToken: tokenJson.access_token,
          spotifyRefreshToken: tokenJson.refresh_token ?? null,
          spotifyTokenExpiry: new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000),
        },
      });

      const jwt = signToken({ sub: user.id });

      res.json({
        token: jwt,
        user: { id: user.id, email: user.email, name: user.name, spotifyId: user.spotifyId },
      });
    } catch {
      res.status(500).json({ error: 'auth_failed' });
    }
  }
}

export default spotify_oauth;