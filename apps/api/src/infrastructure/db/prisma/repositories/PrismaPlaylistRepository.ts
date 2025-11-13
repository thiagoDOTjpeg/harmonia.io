import { UserPlaylist } from '@/domain/entities/UserPlaylist';
import { PrismaClient } from '@prisma/client';
import { IPlaylistRepository } from '../../../../application/repositories/IPlaylistRepository';
import { SyncedPlaylist } from '../../../../domain/entities/SyncedPlaylist';
import { UserPlaylistsMapper } from '../mapper/UserPlaylistsMapper';

export class PrismaPlaylistRepository implements IPlaylistRepository {
  constructor(private readonly prisma: PrismaClient) { }

  private toDomain(prismaPlaylist: any): SyncedPlaylist {
    return new SyncedPlaylist(
      prismaPlaylist.id,
      prismaPlaylist.userId,
      prismaPlaylist.youtubePlaylistId,
      prismaPlaylist.youtubeUrl,
      prismaPlaylist.youtubeTitle,
      prismaPlaylist.spotifyPlaylistId,
      prismaPlaylist.spotifyUrl,
      prismaPlaylist.spotifyTitle,
      prismaPlaylist.syncStatus,
      prismaPlaylist.lastSyncedAt,
      prismaPlaylist.createdAt,
      prismaPlaylist.updatedAt,
    );
  }

  async findByYoutubePlaylistId(userId: string, youtubePlaylistId: string): Promise<SyncedPlaylist | null> {
    const playlist = await this.prisma.syncedPlaylist.findUnique({
      where: {
        userId_youtubePlaylistId: {
          userId,
          youtubePlaylistId,
        },
      },
    });
    return playlist ? this.toDomain(playlist) : null;
  }

  async findByUserId(userId: string): Promise<SyncedPlaylist[]> {
    const playlists = await this.prisma.syncedPlaylist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return playlists.map(p => this.toDomain(p));
  }

  async findByUserIdView(userId: string): Promise<UserPlaylist[]> {
    const playlists = await this.prisma.userPlaylists.findMany({
      where: { userId },
    });
    return playlists.map(p => UserPlaylistsMapper.toDomain(p));
  }

  async create(input: {
    userId: string;
    youtubePlaylistId: string;
    youtubeUrl: string;
    youtubeTitle: string | null;
    spotifyPlaylistId: string;
    spotifyUrl: string;
    spotifyTitle: string | null;
  }): Promise<SyncedPlaylist> {
    const playlist = await this.prisma.syncedPlaylist.create({
      data: {
        userId: input.userId,
        youtubePlaylistId: input.youtubePlaylistId,
        youtubeUrl: input.youtubeUrl,
        youtubeTitle: input.youtubeTitle,
        spotifyPlaylistId: input.spotifyPlaylistId,
        spotifyUrl: input.spotifyUrl,
        spotifyTitle: input.spotifyTitle,
        syncStatus: 'pending',
      },
    });
    return this.toDomain(playlist);
  }

  async updateSyncStatus(id: string, input: {
    status: string;
    lastSyncedAt: Date;
  }): Promise<SyncedPlaylist> {
    const playlist = await this.prisma.syncedPlaylist.update({
      where: { id },
      data: {
        syncStatus: input.status,
        lastSyncedAt: input.lastSyncedAt,
      },
    });
    return this.toDomain(playlist);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.syncedPlaylist.delete({
      where: { id },
    });
  }

  async findByIdWithTracks(playlistId: string): Promise<any | null> {
    return await this.prisma.syncedPlaylist.findUnique({
      where: { id: playlistId },
      include: {
        playlistTracks: {
          include: {
            track: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });
  }
}