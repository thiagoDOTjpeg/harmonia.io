import { SpotifySearchResult } from "@/types/spotify";

export interface ISpotifyMusicClient {
  searchTrack(youtubeTitle: string, channelTitle: string): Promise<SpotifySearchResult | null>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
}