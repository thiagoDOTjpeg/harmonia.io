import { PrismaClient } from '@prisma/client';
import { IUserRepository, UserRecord } from '../../../../application/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findByGoogleId(googleId: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { googleId } }) as any;
  }

  async findBySpotifyId(spotifyId: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { spotifyId } }) as any;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } }) as any;
  }

  async createFromSpotify(
    input: {
      email: string;
      name: string | null;
      spotifyId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord> {
    return this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        spotifyId: input.spotifyId,
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? null,
        googleTokenExpiry: input.tokenExpiry,
      },
    }) as any;
  }


  async createFromGoogle(input: {
    email: string;
    name: string | null;
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<UserRecord> {
    return this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        googleId: input.googleId,
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? null,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? null,
      },
    }) as any;
  }

  async createFromLocal(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }): Promise<UserRecord> {
    return this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        passwordHash: input.passwordHash,
      },
    }) as any;
  }

  async linkToSpotifyToUser(
    userId: string,
    input: {
      spotifyId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        spotifyId: input.spotifyId,
        spotifyAccessToken: input.accessToken,
        spotifyRefreshToken: input.refreshToken ?? undefined,
        spotifyTokenExpiry: input.tokenExpiry,
      },
    }) as any;
  }

  async linkGoogleToUser(userId: string, input: {
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<UserRecord> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        googleId: input.googleId,
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? undefined,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? undefined,
      },
    }) as any;
  }

  async updateGoogleTokens(userId: string, input: {
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<UserRecord> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? undefined,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? undefined,
      },
    }) as any;
  }

  async updateSpotifyTokens(
    userId: string,
    input: {
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        spotifyAccessToken: input.accessToken,
        spotifyRefreshToken: input.refreshToken ?? undefined,
        spotifyTokenExpiry: input.tokenExpiry,
      },
    }) as any;
  }
}