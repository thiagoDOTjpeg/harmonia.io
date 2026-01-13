import { SpotifySearchResult } from "@/types/spotify";

export interface ISpotifyMusicClient {
  searchTrack(youtubeTitle: string, channelTitle: string, accessToken: string): Promise<SpotifySearchResult | null>;
  addTracksToPlaylist(playlistId: string, trackUris: string[], accessToken: string, spotifyId: string): Promise<void>;
  createPlaylist(name: string, accessToken: string, spotifyId: string, description?: string): Promise<string>;
}