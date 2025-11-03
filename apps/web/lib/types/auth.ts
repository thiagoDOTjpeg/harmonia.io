export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    spotifyId?: string;
    googleId?: string;
    youtubeChannelId?: string;
  };
}

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}