import { Request, Response } from 'express';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { OAuthState, SpotifyMe, SpotifyPlaylist, SpotifySearchResponse, SpotifyTokenResponse, SpotifyTrack } from '../types';

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

const spotifyStore = new Map<string, OAuthState>();

const buildAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

const spotify_oauth = class spotify_oauth {
  static async startLogin(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined;
    spotifyStore.set(state, { mode: 'login', returnTo });
    res.redirect(buildAuthUrl(state));
  }

  static async startRegister(req: Request, res: Response) {
    const state = Math.random().toString(36).slice(2);
    const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined;
    spotifyStore.set(state, { mode: 'register', returnTo });
    res.redirect(buildAuthUrl(state));
  }

  static async callback(req: Request, res: Response) {
    try {
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;
      if (!code || !state) return res.status(400).json({ error: 'invalid_state_or_code' });
      const stateData = spotifyStore.get(state);
      if (!stateData) return res.status(400).json({ error: 'invalid_state_or_code' });
      spotifyStore.delete(state);
      const { mode, returnTo } = stateData;

      // Troca code por tokens
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

      const tokenJson = (await tokenRes.json()) as SpotifyTokenResponse
      const expiresAt = new Date(Date.now() + Math.max(tokenJson.expires_in - 60, 0) * 1000);

      // Perfil do usuário
      const meRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (!meRes.ok) {
        return res.status(400).json({ error: 'me_fetch_failed', details: await meRes.text() });
      }
      const me = (await meRes.json()) as SpotifyMe
      const normalizedEmail = me.email ? me.email.trim().toLowerCase() : undefined;

      // 1) Se já existe por spotifyId → atualiza tokens e autentica
      const bySpotify = await prisma.user.findUnique({ where: { spotifyId: me.id } });
      if (bySpotify) {
        const updated = await prisma.user.update({
          where: { id: bySpotify.id },
          data: {
            email: normalizedEmail ?? undefined, // opcional: atualizar se antes era placeholder e este está livre
            name: me.display_name ?? undefined,
            spotifyAccessToken: tokenJson.access_token,
            spotifyRefreshToken: tokenJson.refresh_token ?? bySpotify.spotifyRefreshToken,
            spotifyTokenExpiry: expiresAt,
          },
        });
        const jwt = signToken({ sub: updated.id });
        return res.json({
          token: jwt,
          user: { id: updated.id, email: updated.email, name: updated.name, spotifyId: updated.spotifyId },
          returnTo,
        });
      }

      if (mode === 'register') {
        // Registro com OAuth: bloqueia se email já está em uso
        if (normalizedEmail) {
          const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
          if (existing) {
            return res.status(409).json({
              error: 'email_in_use',
              message: 'Já existe uma conta com este email. Faça login e conecte o Spotify nas configurações.',
            });
          }
        } else {
          // Spotify pode não fornecer email → preferir exigir link manual
          return res.status(409).json({
            error: 'email_ambiguous',
            message: 'Não foi possível obter o email da conta Spotify. Conecte manualmente após login.',
          });
        }

        const created = await prisma.user.create({
          data: {
            email: normalizedEmail!,
            name: me.display_name ?? null,
            spotifyId: me.id,
            spotifyAccessToken: tokenJson.access_token,
            spotifyRefreshToken: tokenJson.refresh_token ?? null,
            spotifyTokenExpiry: expiresAt,
          },
        });
        const jwt = signToken({ sub: created.id });
        return res.status(201).json({
          token: jwt,
          user: { id: created.id, email: created.email, name: created.name, spotifyId: created.spotifyId },
          returnTo,
        });
      }

      // mode === 'login' → link automático se houver email
      if (normalizedEmail) {
        const userByEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!userByEmail) {
          return res.status(404).json({
            error: 'no_account',
            message: 'Conta não encontrada. Crie uma conta (registrar) com Spotify.',
          });
        }

        const updated = await prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            name: userByEmail.name ?? me.display_name ?? null,
            spotifyId: me.id,
            spotifyAccessToken: tokenJson.access_token,
            spotifyRefreshToken: tokenJson.refresh_token ?? userByEmail.spotifyRefreshToken,
            spotifyTokenExpiry: expiresAt,
          },
        });
        const jwt = signToken({ sub: updated.id });
        return res.json({
          token: jwt,
          user: { id: updated.id, email: updated.email, name: updated.name, spotifyId: updated.spotifyId },
          returnTo,
        });
      }

      return res.status(409).json({
        error: 'require_manual_link',
        message: 'Não foi possível obter o email da conta Spotify. Conecte manualmente após login.',
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        return res.status(409).json({ error: 'conflict', message: 'Conflito de vínculo de conta.' });
      }
      return res.status(500).json({ error: 'auth_failed' });
    }
  }

  static async ensureValidToken(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.spotifyAccessToken) {
      throw new Error('User not connected to Spotify');
    }

    // Se token ainda é válido, retorna
    if (user.spotifyTokenExpiry && user.spotifyTokenExpiry > new Date()) {
      return user.spotifyAccessToken;
    }

    // Refresh token
    if (!user.spotifyRefreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Spotify token');
    }

    const data = await response.json() as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
    };

    const expiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        spotifyAccessToken: data.access_token,
        spotifyRefreshToken: data.refresh_token ?? user.spotifyRefreshToken,
        spotifyTokenExpiry: expiresAt,
      },
    });

    return data.access_token;
  }

  // Criar playlist no Spotify
  static async createPlaylist(
    accessToken: string,
    name: string,
    description?: string
  ): Promise<SpotifyPlaylist> {
    // Pegar ID do usuário do Spotify
    const meRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const me = await meRes.json() as { id: string };

    // Criar playlist
    const response = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: description || 'Sincronizada do YouTube via Harmonia.io',
        public: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Spotify playlist');
    }

    return response.json() as Promise<SpotifyPlaylist>;
  }

  // Buscar música no Spotify
  static async searchTrack(
    accessToken: string,
    query: string
  ): Promise<SpotifyTrack | null> {
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: '5',
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data = await response.json() as SpotifySearchResponse;
    return data.tracks.items[0] || null;
  }

  // Adicionar músicas na playlist
  static async addTracksToPlaylist(
    accessToken: string,
    playlistId: string,
    trackUris: string[]
  ): Promise<void> {
    // Spotify aceita no máximo 100 tracks por requisição
    const chunks = [];
    for (let i = 0; i < trackUris.length; i += 100) {
      chunks.push(trackUris.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: chunk }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add tracks to Spotify playlist');
      }
    }
  }

  // Pegar tracks de uma playlist
  static async getPlaylistTracks(
    accessToken: string,
    playlistId: string
  ): Promise<SpotifyTrack[]> {
    const tracks: SpotifyTrack[] = [];
    let url: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify playlist tracks');
      }

      const data = await response.json() as {
        items: Array<{ track: SpotifyTrack }>;
        next: string | null;
      };

      tracks.push(...data.items.map((item) => item.track));
      url = data.next;
    }

    return tracks;
  }
};

export default spotify_oauth;