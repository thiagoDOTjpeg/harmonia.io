import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ERRORS } from "@/types/constant/errors";
import { YouTubePlaylistInfo, YouTubeVideo } from "@/types/google";
import { YouTubePlaylistItemsResponse, YouTubePlaylistResponse } from "@/types/playlist";
import { AppError } from "@harmonia/shared";

export class GoogleMusicClient implements IGoogleMusicClient {
  async getPlaylistInfo(playlistId: string, accessToken: string): Promise<YouTubePlaylistInfo> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      id: playlistId,
    })
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new AppError(ERRORS.PLAYLIST_NOT_FOUND);
    }

    const data = await response.json() as YouTubePlaylistResponse;
    const playlist = data.items?.[0];

    if (!playlist) {
      throw new Error(ERRORS.PLAYLIST_NOT_FOUND);
    }

    return {
      id: playlist.id,
      title: playlist.snippet.title,
      channelTile: playlist.snippet.channelTitle,
      description: playlist.snippet.description || '',
      itemCount: playlist.contentDetails.itemCount,
    };
  }

  async getPlaylistItems(playlistId: string, accessToken: string): Promise<YouTubeVideo[]> {
    const videos: YouTubeVideo[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: '50',
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new AppError(ERRORS.PLAYLIST_NOT_FOUND);
      }

      const data = await response.json() as YouTubePlaylistItemsResponse;

      for (const item of data.items || []) {
        videos.push({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle || 'Unknown',
          videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle

        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return videos;
  }
}