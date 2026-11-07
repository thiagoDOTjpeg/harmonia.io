export interface SyncPlaylistResponse {
  jobId: string;
  playlistId: string | null;
  status: string;
  message: string;
}

export interface TrackDTO {
  id: string;
  youtube_video_id: string;
  youtube_title: string;
  youtube_channel: string | null;
  spotify_track_id: string | null;
  spotify_uri: string | null;
  spotify_artist: string | null;
  spotify_album: string | null;
  match_score: number;
  matched_at: string | null;
  match_source: string | null;
}

export interface PlaylistTrackItemDTO {
  id: string;
  position: number | null;
  status: "synced" | "pending" | "failed";
  added_at: string;
  track: TrackDTO;
}

export interface PlaylistDetailsStatsDTO {
  total: number;
  synced: number;
  pending: number;
  failed: number;
  low_confidence: number;
}

export interface PlaylistDetailsDTO {
  id: string;
  user_id: string;
  youtube_playlist_id: string;
  youtube_url: string;
  youtube_title: string | null;
  spotify_playlist_id: string;
  spotify_url: string;
  spotify_title: string | null;
  sync_status: string;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
  stats: PlaylistDetailsStatsDTO;
  tracks: PlaylistTrackItemDTO[];
}

export interface SpotifyTrackCandidateDTO {
  trackId: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  durationMs: number | null;
  externalUrl: string;
  matchScore: number;
}

export interface TrackCandidatesResponseDTO {
  trackId: string;
  youtubeTitle: string;
  youtubeChannel: string | null;
  generatedQuery: string;
  candidates: SpotifyTrackCandidateDTO[];
}

export interface MatchTrackRequestDTO {
  spotifyTrackId: string;
  spotifyUri: string;
  spotifyArtist: string;
  spotifyAlbum: string;
  syncNow?: boolean;
}

export interface MatchTrackResponseDTO {
  playlistId: string;
  playlistStatus: string;
  playlistTrackId: string;
  playlistTrackStatus: "synced" | "pending" | "failed";
  syncedToSpotify: boolean;
  track: TrackDTO;
}