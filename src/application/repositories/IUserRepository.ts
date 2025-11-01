export interface UserRecord {
  id: string;
  email: string | null;
  name: string | null;
  spotifyId?: string | null;
  spotifyAccessToken?: string | null;
  spotifyRefreshToken?: string | null;
  spotifyTokenExpiry?: Date | null;
  googleId?: string | null;
  googleAccessToken?: string | null;
  googleRefreshToken?: string | null;
  googleTokenExpiry?: Date | null;
  youtubeChannelId?: string | null;
}

export interface IUserRepository {
  findBySpotifyId(spotifyId: string): Promise<UserRecord | null>;

  findByGoogleId(googleId: string): Promise<UserRecord | null>;

  findByEmail(email: string): Promise<UserRecord | null>;

  createFromSpotify(
    input: {
      email: string;
      name: string | null;
      spotifyId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord>;

  createFromGoogle(
    input: {
      email: string;
      name: string | null;
      googleId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
      youtubeChannelId?: string | null;
    }
  ): Promise<UserRecord>;

  linkGoogleToUser(
    userId: string,
    input: {
      googleId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
      youtubeChannelId?: string | null;
    }
  ): Promise<UserRecord>;

  linkToSpotifyToUser(
    userId: string,
    input: {
      spotifyId: string;
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord>;

  updateGoogleTokens(
    userId: string,
    input: {
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
      youtubeChannelId?: string | null;
    }
  ): Promise<UserRecord>;

  updateSpotifyTokens(
    userId: string,
    input: {
      accessToken: string;
      refreshToken?: string | null;
      tokenExpiry: Date;
    }
  ): Promise<UserRecord>;
}