import { PrismaClient } from '@prisma/client';
import { ITrackRepository } from '../../../../application/repositories/ITrackRepository';
import { Track } from '../../../../domain/entities/Track';

export class PrismaTrackRepository implements ITrackRepository {
  constructor(private readonly prisma: PrismaClient) { }
  private toDomain(prismaTrack: any): Track {
    return new Track(
      prismaTrack.id,
      prismaTrack.youtubeVideoId,
      prismaTrack.youtubeTitle,
      prismaTrack.youtubeChannel,
      prismaTrack.spotifyTrackId,
      prismaTrack.spotifyUri,
      prismaTrack.spotifyArtist,
      prismaTrack.spotifyAlbum,
      prismaTrack.matchScore,
      prismaTrack.matchedAt,
      prismaTrack.matchSource,
      prismaTrack.isOfficialVideo,
      prismaTrack.isVisualizer,
      prismaTrack.isLive,
      prismaTrack.aiConfidence,
      prismaTrack.createdAt,
      prismaTrack.updatedAt,
    );
  }

  async findManyByYoutubeIds(inputs: string[]): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: { youtubeVideoId: { in: inputs } }
    })
    return tracks.map((track) => this.toDomain(track));
  }


  async findByYoutubeVideoId(youtubeVideoId: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { youtubeVideoId },
    });
    return track ? this.toDomain(track) : null;
  }

  async create(input: {
    youtubeVideoId: string;
    youtubeTitle: string;
    youtubeChannel: string | null;
    spotifyTrackId?: string | null;
    spotifyUri?: string | null;
    spotifyArtist?: string | null;
    spotifyAlbum?: string | null;
    matchScore?: number;
    matchSource?: string | null;
  }): Promise<Track> {
    const track = await this.prisma.track.create({
      data: {
        youtubeVideoId: input.youtubeVideoId,
        youtubeTitle: input.youtubeTitle,
        youtubeChannel: input.youtubeChannel,
        spotifyTrackId: input.spotifyTrackId ?? null,
        spotifyUri: input.spotifyUri ?? null,
        spotifyArtist: input.spotifyArtist ?? null,
        spotifyAlbum: input.spotifyAlbum ?? null,
        matchScore: input.matchScore ?? 0,
        matchedAt: input.spotifyTrackId ? new Date() : null,
        matchSource: input.matchSource ?? null,
      },
    });
    return this.toDomain(track);
  }

  async updateSpotifyMatch(trackId: string, input: {
    spotifyTrackId: string;
    spotifyUri: string;
    spotifyArtist: string | null;
    spotifyAlbum: string | null;
    matchScore: number;
    matchSource: string;
  }): Promise<Track> {
    const track = await this.prisma.track.update({
      where: { id: trackId },
      data: {
        spotifyTrackId: input.spotifyTrackId,
        spotifyUri: input.spotifyUri,
        spotifyArtist: input.spotifyArtist,
        spotifyAlbum: input.spotifyAlbum,
        matchScore: input.matchScore,
        matchSource: input.matchSource,
        matchedAt: new Date(),
      },
    });
    return this.toDomain(track);
  }
}