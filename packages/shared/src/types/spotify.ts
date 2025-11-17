import { OAuthProviderToken } from "./oauth";

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  external_urls: { spotify: string };
  images: Array<{ url: string }>;
  tracks: { total: number };
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string };
  duration_ms: number;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyMe {
  id: string;
  email?: string | null;
  display_name?: string | null;
}

export interface SpotifyTokenResponse extends OAuthProviderToken {
}

export interface SpotifyExchangeResult {
  tokens: SpotifyTokenResponse;
  profile: SpotifyMe;
}

export interface SpotifyCreatePlaylistResponse {
  id: string;
}

export interface SpotifySearchResult {
  trackId: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  matchScore: number;
}

