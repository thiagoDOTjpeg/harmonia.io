import { PrismaClient } from '@prisma/client';
import { IPlaylistTrackRepository } from '../../../../application/repositories/IPlaylistTrackRepository';
import { PlaylistTrack } from '../../../../domain/entities/PlaylistTrack';

export class PrismaPlaylistTrackRepository implements IPlaylistTrackRepository {
  constructor(private readonly prisma: PrismaClient) { }

  private toDomain(prismaPlaylistTrack: any): PlaylistTrack {
    return new PlaylistTrack(
      prismaPlaylistTrack.id,
      prismaPlaylistTrack.playlistId,
      prismaPlaylistTrack.trackId,
      prismaPlaylistTrack.status,
      prismaPlaylistTrack.addedAt,
      prismaPlaylistTrack.position,
    );
  }

  async findByPlaylistId(playlistId: string): Promise<PlaylistTrack[]> {
    const playlistTracks = await this.prisma.playlistTrack.findMany({
      where: { playlistId },
      orderBy: { position: 'asc' },
    });
    return playlistTracks.map(pt => this.toDomain(pt));
  }

  async create(input: {
    playlistId: string;
    trackId: string;
    position?: number;
  }): Promise<PlaylistTrack> {
    const playlistTrack = await this.prisma.playlistTrack.create({
      data: {
        playlistId: input.playlistId,
        trackId: input.trackId,
        position: input.position ?? null,
        status: 'pending',
      },
    });
    return this.toDomain(playlistTrack);
  }

  async updateStatus(id: string, status: 'pending' | 'synced' | 'failed'): Promise<PlaylistTrack> {
    const playlistTrack = await this.prisma.playlistTrack.update({
      where: { id },
      data: { status },
    });
    return this.toDomain(playlistTrack);
  }

  async existsInPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    const count = await this.prisma.playlistTrack.count({
      where: {
        playlistId,
        trackId,
      },
    });
    return count > 0;
  }
}