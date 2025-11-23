import { UserPlaylist } from "@/domain/entities/UserPlaylist";
import { UserPlaylistDTO } from "@harmonia/shared";
import { UserPlaylists as PrismaUserPlaylists } from "@prisma/client";

export class UserPlaylistsMapper {
  static toDTO(userPlaylist: UserPlaylist): UserPlaylistDTO {
    return {
      id: userPlaylist.id,
      user_id: userPlaylist.user_id,
      youtube_playlist_id: userPlaylist.youtube_playlist_id,
      youtube_title: userPlaylist.youtube_title,
      spotify_playlist_id: userPlaylist.spotify_playlist_id,
      spotify_title: userPlaylist.spotify_title,
      sync_status: userPlaylist.sync_status,
      last_synced_at: userPlaylist.last_synced_at,
      songs: userPlaylist.songs,
      created_at: userPlaylist.created_at,
      updated_at: userPlaylist.updated_at
    }
  }

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