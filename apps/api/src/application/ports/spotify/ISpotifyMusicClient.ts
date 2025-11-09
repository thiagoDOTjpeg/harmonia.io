import { SpotifySearchResult } from '@harmonia/shared';


export interface ISpotifyMusicClient {
  searchTrack(youtubeTitle: string, channelTitle: string): Promise<SpotifySearchResult | null>;
  addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void>;
}