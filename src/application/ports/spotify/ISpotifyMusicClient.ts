export interface SpotifySearchResult {
  trackId: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  matchScore: number;
}

export interface ISpotifyMusicClient {
  searchTrack(query: string): Promise<SpotifySearchResult | null>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
}