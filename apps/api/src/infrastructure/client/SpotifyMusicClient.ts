import { logger } from '@/infrastructure/logger';
import { SearchCandidatesParams, SpotifyCreatePlaylistResponse, SpotifySearchResponse, SpotifySearchResult, SpotifyTrack } from '@/types/spotify';
import { SpotifyTrackCandidateDTO } from '@harmonia/shared';
import { ISpotifyMusicClient } from '../../application/ports/spotify/ISpotifyMusicClient';
import { MusicMatchingService } from '../../domain/services/MusicMatchingService';


export class SpotifyMusicClient implements ISpotifyMusicClient {
  private mapTrackToCandidate(track: SpotifyTrack, matchScore: number): SpotifyTrackCandidateDTO {
    return {
      trackId: track.id,
      uri: track.uri,
      name: track.name,
      artist: track.artists?.map((a) => a.name).join(', ') || 'Unknown',
      album: track.album?.name ?? 'Unknown',
      imageUrl: track.album?.images?.[0]?.url ?? null,
      durationMs: track.duration_ms ?? null,
      externalUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
      matchScore: Math.round(matchScore * 100) / 100,
    };
  }

  private extractSpotifyTrackId(input: string): string | null {
    const trimmed = input.trim();
    const match = trimmed.match(
      /(?:spotify:track:|open\.spotify\.com\/(?:intl-[a-zA-Z-]+\/)?track\/)([a-zA-Z0-9]{22})/
    );
    if (match?.[1]) {
      return match[1];
    }
    if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  }

  private async fetchSpotifyTracksByQuery(query: string, limit: number, accessToken: string): Promise<SpotifyTrack[]> {
    const response = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: query,
        type: 'track',
        limit: String(limit),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      logger.error({ error: await response.text(), query }, 'Spotify candidate search failed');
      return [];
    }

    const data = (await response.json()) as SpotifySearchResponse;
    return data.tracks?.items || [];
  }

  async searchCandidates(params: SearchCandidatesParams, accessToken: string): Promise<SpotifyTrackCandidateDTO[]> {
    const limit = params.limit ?? 8;
    const rawQuery = params.query?.trim();
    const youtubeTitle = params.youtubeTitle ?? '';
    const channelTitle = params.channelTitle ?? '';

    const referenceQuery = youtubeTitle
      ? MusicMatchingService.generateSpotifyQuery(youtubeTitle, channelTitle)
      : null;
    const cleanedFromTitle = youtubeTitle
      ? MusicMatchingService.cleanYouTubeTitle(youtubeTitle)
      : null;

    const computeBestScore = (track: SpotifyTrack, fallbackQuery?: string) => {
      if (!referenceQuery) {
        return MusicMatchingService.calculateMatchScore(
          { title: fallbackQuery || '', artist: null },
          { name: track.name, artists: track.artists || [] }
        );
      }

      const primaryScore = MusicMatchingService.calculateMatchScore(
        {
          title: referenceQuery.expectedTitle,
          artist: referenceQuery.expectedArtist,
        },
        {
          name: track.name,
          artists: track.artists || [],
        }
      );

      let altScore = 0;
      if (cleanedFromTitle?.artist) {
        altScore = MusicMatchingService.calculateMatchScore(
          {
            title: cleanedFromTitle.title,
            artist: cleanedFromTitle.artist,
          },
          {
            name: track.name,
            artists: track.artists || [],
          }
        );
      }

      const rawTitleScore = MusicMatchingService.calculateMatchScore(
        {
          title: youtubeTitle.replace(/[()[\]]/g, ' '),
          artist: MusicMatchingService.extractArtistFromChannel(channelTitle),
        },
        {
          name: track.name,
          artists: track.artists || [],
        }
      );

      return Math.max(primaryScore, altScore, rawTitleScore);
    };

    if (rawQuery) {
      const directTrackId = this.extractSpotifyTrackId(rawQuery);
      if (directTrackId) {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${directTrackId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const track = (await response.json()) as SpotifyTrack;
          return [this.mapTrackToCandidate(track, 1.0)];
        }
      }

      const items = await this.fetchSpotifyTracksByQuery(rawQuery, limit, accessToken);
      return items.map((track) => {
        const score = computeBestScore(track, rawQuery);
        return this.mapTrackToCandidate(track, score);
      });
    }

    if (!referenceQuery) {
      return [];
    }

    const tracksMap = new Map<string, SpotifyTrack>();

    const candidateQueries = new Set<string>();
    candidateQueries.add(referenceQuery.query);

    if (cleanedFromTitle?.artist && cleanedFromTitle.artist !== referenceQuery.expectedArtist) {
      candidateQueries.add(`${cleanedFromTitle.artist} ${cleanedFromTitle.title}`.trim());
    }

    const broadQuery = [referenceQuery.expectedTitle, referenceQuery.expectedArtist]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (broadQuery) {
      candidateQueries.add(broadQuery);
    }

    const unstrippedTitle = youtubeTitle
      .replace(/[()[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const channelArtist = MusicMatchingService.extractArtistFromChannel(channelTitle);
    if (unstrippedTitle) {
      candidateQueries.add(
        channelArtist ? `${channelArtist} ${unstrippedTitle}` : unstrippedTitle
      );
    }

    for (const q of candidateQueries) {
      if (tracksMap.size >= limit) break;
      const items = await this.fetchSpotifyTracksByQuery(q, limit, accessToken);
      for (const item of items) {
        if (!tracksMap.has(item.id)) {
          tracksMap.set(item.id, item);
        }
      }
    }

    const candidates = Array.from(tracksMap.values()).map((track) => {
      const score = computeBestScore(track);
      return this.mapTrackToCandidate(track, score);
    });

    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }

  async searchTrack(youtubeTitle: string, channelTitle: string, accessToken: string): Promise<SpotifySearchResult | null> {
    const query = MusicMatchingService.generateSpotifyQuery(youtubeTitle, channelTitle);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: query.query,
        type: 'track',
        limit: '5',
      })}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      logger.error({ error: await response.text() }, 'Spotify search failed');
      return null;
    }

    const data = (await response.json()) as SpotifySearchResponse;
    const tracks = data.tracks?.items;

    if (!tracks || tracks.length === 0) {
      logger.debug({ youtubeTitle }, 'No Spotify results found');
      return null;
    }

    let bestMatch: SpotifySearchResult | null = null;
    let bestScore = 0;

    for (const track of tracks) {
      const score = MusicMatchingService.calculateMatchScore(
        {
          title: query.expectedTitle,
          artist: query.expectedArtist,
        },
        {
          name: track.name,
          artists: track.artists || [],
        }
      );

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
      logger.debug(
        { youtubeTitle, matchedTrack: bestMatch.name, artist: bestMatch.artist, score: bestMatch.matchScore },
        'Match found'
      );
      return bestMatch;
    }

    logger.debug(
      { youtubeTitle, bestScore },
      'No good match found'
    );
    return null;
  }

  async createPlaylist(name: string, accessToken: string, _spotifyId: string, description?: string): Promise<string> {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  async addTracksToPlaylist(playlistId: string, trackUris: string[], accessToken: string, _spotifyId: string): Promise<void> {
    const chunks = this.chunkArray(trackUris, 100);

    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/items`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
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