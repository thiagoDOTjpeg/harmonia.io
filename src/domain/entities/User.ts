export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string | null,
    public passwordHash: string | null = null,
    public googleId: string | null = null,
    public spotifyId: string | null = null,
    public googleAccessToken: string | null = null,
    public googleRefreshToken: string | null = null,
    public googleTokenExpiry: Date | null = null,
    public youtubeChannelId: string | null = null,
    public spotifyAccessToken: string | null = null,
    public spotifyRefreshToken: string | null = null,
    public spotifyTokenExpiry: Date | null = null,
  ) { }

  // Métodos de domínio (regras de negócio)
  hasGoogleLinked(): boolean {
    return !!this.googleId;
  }

  hasSpotifyLinked(): boolean {
    return !!this.spotifyId;
  }

  hasLocalAuth(): boolean {
    return !!this.passwordHash;
  }

  isGoogleTokenExpired(): boolean {
    if (!this.googleTokenExpiry) return true;
    return new Date() >= this.googleTokenExpiry;
  }

  isSpotifyTokenExpired(): boolean {
    if (!this.spotifyTokenExpiry) return true;
    return new Date() >= this.spotifyTokenExpiry;
  }
}