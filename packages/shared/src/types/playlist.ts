export interface SyncPlaylistInput {
  userId: string;
  youtubePlaylistId: string;
  googleAccessToken: string;
  spotifyAccessToken: string;
  spotifyUserId: string;
}

export interface SyncPlaylistResult {
  playlistId: string;
  totalTracks: number;
  syncedTracks: number;
  failedTracks: number;
  newTracks: number;
  status: 'completed' | 'partial' | 'failed';
}

export interface YouTubePlaylistResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      videoOwnerChannelTitle: string;
      description?: string;
    };
    contentDetails: {
      itemCount: number;
    };
  }>;
}

export interface YouTubePlaylistItemsResponse {
  items?: Array<{
    snippet: {
      title: string;
      resourceId: {
        videoId: string;
      };
      channelTitle?: string;
      videoOwnerChannelTitle: string;
    };
  }>;
  nextPageToken?: string;
}

export interface UserPlaylist {
  id: string,
  user_id: string,
  youtube_playlist_id: string,
  youtube_title: string | null,
  spotify_playlist_id: string,
  spotify_title: string | null,
  sync_status: string,
  last_synced_at: string | null,
  songs: number,
  created_at: string,
  updated_at: string
}