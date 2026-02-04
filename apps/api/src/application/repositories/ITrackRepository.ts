import { Track } from '../../domain/entities/Track';

export interface ITrackRepository {
  findByYoutubeVideoId(youtubeVideoId: string): Promise<Track | null>;

  create(input: {
    youtubeVideoId: string;
    youtubeTitle: string;
    youtubeChannel: string | null;
    spotifyTrackId?: string | null;
    spotifyUri?: string | null;
    spotifyArtist?: string | null;
    spotifyAlbum?: string | null;
    matchScore?: number;
    matchSource?: string | null;
  }): Promise<Track>;

  findManyByYoutubeIds(inputs: string[]): Promise<Track[]>;

  updateSpotifyMatch(trackId: string, input: {
    spotifyTrackId: string;
    spotifyUri: string;
    spotifyArtist: string | null;
    spotifyAlbum: string | null;
    matchScore: number;
    matchSource: string;
  }): Promise<Track>;
}