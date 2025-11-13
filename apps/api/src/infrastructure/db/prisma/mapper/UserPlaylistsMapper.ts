import { UserPlaylist } from "@/domain/entities/UserPlaylist";
import { UserPlaylists as PrismaUserPlaylists } from "@prisma/client";

export class UserPlaylistsMapper {
  static toDomain(prisma: PrismaUserPlaylists) {
    return new UserPlaylist(
      prisma.id,
      prisma.userId,
      prisma.youtubePlaylistId,
      prisma.youtubeTitle,
      prisma.spotifyPlaylistId,
      prisma.spotifyTitle,
      prisma.syncStatus,
      prisma.lastSyncedAt?.toISOString() ?? "",
      Number(prisma.songs),
      prisma.createdAt.toISOString(),
      prisma.updatedAt.toISOString()
    )
  }
}