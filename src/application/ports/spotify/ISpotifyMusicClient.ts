import { SpotifySearchResult } from "../../../shared/types/spotify";


export interface ISpotifyMusicClient {
  searchTrack(query: string): Promise<SpotifySearchResult | null>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
}