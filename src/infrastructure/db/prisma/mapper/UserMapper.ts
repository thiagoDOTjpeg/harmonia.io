import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../../domain/entities/User';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.passwordHash,
      prismaUser.googleId,
      prismaUser.spotifyId,
      prismaUser.googleAccessToken,
      prismaUser.googleRefreshToken,
      prismaUser.googleTokenExpiry,
      prismaUser.youtubeChannelId,
      prismaUser.spotifyAccessToken,
      prismaUser.spotifyRefreshToken,
      prismaUser.spotifyTokenExpiry,
    );
  }

  static toPrisma(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'emailVerifiedAt'> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      spotifyId: user.spotifyId,
      spotifyAccessToken: user.spotifyAccessToken,
      spotifyRefreshToken: user.spotifyRefreshToken,
      spotifyTokenExpiry: user.spotifyTokenExpiry,
      googleId: user.googleId,
      googleAccessToken: user.googleAccessToken,
      googleRefreshToken: user.googleRefreshToken,
      googleTokenExpiry: user.googleTokenExpiry,
      youtubeChannelId: user.youtubeChannelId,
    };
  }
}