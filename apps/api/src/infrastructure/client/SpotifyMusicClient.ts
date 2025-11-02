import { ISpotifyMusicClient } from '../../application/ports/spotify/ISpotifyMusicClient';
import { MusicMatchingService } from '../../domain/services/MusicMatchingService';
import { SpotifyCreatePlaylistResponse, SpotifySearchResponse, SpotifySearchResult } from '@harmonia/shared';


export class SpotifyMusicClient implements ISpotifyMusicClient {
  constructor(
    private readonly accessToken: string,
    private readonly spotifyId: string
  ) { }

  async searchTrack(youtubeTitle: string, channelTitle: string): Promise<SpotifySearchResult | null> {
    const query = MusicMatchingService.generateSpotifyQuery(youtubeTitle, channelTitle);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: query,
        type: 'track',
        limit: '5',
      })}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Spotify search failed:', await response.text());
      return null;
    }

    const data = (await response.json()) as SpotifySearchResponse;
    const tracks = data.tracks?.items;

    if (!tracks || tracks.length === 0) {
      console.log(`No Spotify results for: ${youtubeTitle}`);
      return null;
    }

    let bestMatch: SpotifySearchResult | null = null;
    let bestScore = 0;

    for (const track of tracks) {
      const score = MusicMatchingService.calculateMatchScore({ title: youtubeTitle, channelTitle }, {
        name: track.name,
        artists: track.artists || [],
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          trackId: track.id,
          uri: track.uri,
          name: track.name,
          artist: track.artists?.[0]?.name ?? 'Unknown',
          album: track.album?.name ?? 'Unknown',
          matchScore: score,
        };
      }
    }

    if (bestMatch && bestMatch.matchScore > 0.6) {
      console.log(
        `✅ Match found: "${youtubeTitle}" → "${bestMatch.name}" by ${bestMatch.artist} (score: ${bestMatch.matchScore.toFixed(2)})`
      );
      return bestMatch;
    }

    console.log(
      `❌ No good match for: "${youtubeTitle}" (best score: ${bestScore.toFixed(2)})`
    );
    return null;
  }

  async createPlaylist(name: string, description?: string): Promise<string> {
    const response = await fetch(
      `https://api.spotify.com/v1/users/${this.spotifyId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: description || `Synced from YouTube by Harmonia.io`,
          public: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create playlist: ${await response.text()}`);
    }

    const data = (await response.json()) as SpotifyCreatePlaylistResponse;
    return data.id;
  }

  async addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void> {
    const chunks = this.chunkArray(trackUris, 100);

    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: chunk }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add tracks: ${await response.text()}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}