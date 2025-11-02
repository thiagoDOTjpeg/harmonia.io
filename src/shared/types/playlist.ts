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