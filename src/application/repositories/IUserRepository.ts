import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findBySpotifyId(spotifyId: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;

  createFromSpotify(input: {
    email: string;
    name: string | null;
    spotifyId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User>;

  createFromGoogle(input: {
    email: string;
    name: string | null;
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User>;

  createFromLocal(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }): Promise<User>;

  linkGoogleToUser(userId: string, input: {
    googleId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User>;

  linkToSpotifyToUser(userId: string, input: {
    spotifyId: string;
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User>;

  updateSpotifyTokens(userId: string, input: {
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
  }): Promise<User>;

  updateGoogleTokens(userId: string, input: {
    accessToken: string;
    refreshToken?: string | null;
    tokenExpiry: Date;
    youtubeChannelId?: string | null;
  }): Promise<User>;
}