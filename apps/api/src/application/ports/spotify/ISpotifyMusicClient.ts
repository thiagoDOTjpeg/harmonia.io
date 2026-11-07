import { SearchCandidatesParams, SpotifySearchResult } from "@/types/spotify";
import { SpotifyTrackCandidateDTO } from "@harmonia/shared";

export interface ISpotifyMusicClient {
  searchTrack(youtubeTitle: string, channelTitle: string, accessToken: string): Promise<SpotifySearchResult | null>;
  searchCandidates?(params: SearchCandidatesParams, accessToken: string): Promise<SpotifyTrackCandidateDTO[]>;
  addTracksToPlaylist(playlistId: string, trackUris: string[], accessToken: string, spotifyId: string): Promise<void>;
  createPlaylist(name: string, accessToken: string, spotifyId: string, description?: string): Promise<string>;
}