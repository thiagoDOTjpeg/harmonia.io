
export interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    resourceId: { videoId: string };
    channelTitle: string;
    publishedAt: string;
  };
}


export interface YouTubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}


export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
  scope: string;
  token_type: string;
}

export interface GoogleExchangeResult {
  tokens: GoogleTokenResponse;
  profile: GoogleUserInfo;
  youtubeChannelId?: string;
}

export interface YouTubePlaylistInfo {
  id: string;
  title: string;
  channelTile: string;
  description: string;
  itemCount: number;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  videoOwnerChannelTitle: string;
}