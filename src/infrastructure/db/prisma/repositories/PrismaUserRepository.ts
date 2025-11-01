import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../../application/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserMapper } from '../mapper/UserMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { googleId } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findBySpotifyId(spotifyId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { spotifyId } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async createFromLocal(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        passwordHash: input.passwordHash,
      },
    });
    return UserMapper.toDomain(user);
  }

  async createFromGoogle(input: {
    email: string;
    name: string | null;
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        googleId: input.googleId,
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? null,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? null,
      },
    });
    return UserMapper.toDomain(user);
  }

  async createFromSpotify(input: {
    email: string;
    name: string | null;
    spotifyId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        spotifyId: input.spotifyId,
        spotifyAccessToken: input.accessToken,
        spotifyRefreshToken: input.refreshToken ?? null,
        spotifyTokenExpiry: input.tokenExpiry,
      },
    });
    return UserMapper.toDomain(user);
  }

  async linkGoogleToUser(userId: string, input: {
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleId: input.googleId,
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? undefined,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? undefined,
      },
    });
    return UserMapper.toDomain(user);
  }

  async linkToSpotifyToUser(userId: string, input: {
    spotifyId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        spotifyId: input.spotifyId,
        spotifyAccessToken: input.accessToken,
        spotifyRefreshToken: input.refreshToken ?? undefined,
        spotifyTokenExpiry: input.tokenExpiry,
      },
    });
    return UserMapper.toDomain(user);
  }

  async updateGoogleTokens(userId: string, input: {
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: input.accessToken,
        googleRefreshToken: input.refreshToken ?? undefined,
        googleTokenExpiry: input.tokenExpiry,
        youtubeChannelId: input.youtubeChannelId ?? undefined,
      },
    });
    return UserMapper.toDomain(user);
  }

  async updateSpotifyTokens(userId: string, input: {
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        spotifyAccessToken: input.accessToken,
        spotifyRefreshToken: input.refreshToken ?? undefined,
        spotifyTokenExpiry: input.tokenExpiry,
      },
    });
    return UserMapper.toDomain(user);
  }
}