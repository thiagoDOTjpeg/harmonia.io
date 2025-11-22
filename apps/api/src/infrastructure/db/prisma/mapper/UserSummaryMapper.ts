import { RecentSync } from "@/domain/entities/RecentSync";
import { UserSummary } from "@/domain/entities/UserSummary";
import { UserSummaryDTO } from "@harmonia/shared";
import { Prisma, UserSummary as PrismaUserSummary } from "@prisma/client";

export class UserSummaryMapper {
  static toDTO(summary: UserSummary): UserSummaryDTO {
    return {
      email: summary.email,
      name: summary.name,
      is_spotify_connected: summary.is_spotify_connected,
      is_youtube_connected: summary.is_youtube_connected,
      last_sync_at: summary.last_sync_at,
      synced_playlists: summary.synced_playlists,
      synced_songs: summary.synced_songs,
      synced_songs_last_7_days: summary.synced_songs_last_7_days,
      total_playlists: summary.total_playlists,
      total_songs: summary.total_songs,
      user_id: summary.user_id,
      user_created_at: summary.user_created_at,
      recent_syncs: summary.recent_syncs,
    }
  }

  static toDomain(summary: PrismaUserSummary): UserSummary {
    function mapRecentSync(): RecentSync[] | null {
      if (!summary.recentSyncs) {
        return null;
      }

      if (!Array.isArray(summary.recentSyncs)) {
        return null;
      }

      return summary.recentSyncs.map((item) => {
        const sync = item as Prisma.JsonObject;

        return {
          id: String(sync.id),
          name: String(sync.name),
          status: String(sync.status),
          last_synced_at: String(sync.last_synced_at),
          songs_count: Number(sync.songs_count),
          source_platform: String(sync.source_platform),
          target_platform: String(sync.target_platform)
        } as RecentSync;
      });
    }


    return {
      email: summary.email,
      name: summary.name,
      is_spotify_connected: summary.isSpotifyConnected,
      is_youtube_connected: summary.isYoutubeConnected,
      last_sync_at: summary.lastSyncAt?.toISOString() ?? null,
      synced_playlists: Number(summary.syncedPlaylists),
      synced_songs: Number(summary.syncedSongs),
      synced_songs_last_7_days: Number(summary.syncedSongsLast7Days),
      total_playlists: Number(summary.totalPlaylists),
      total_songs: Number(summary.totalSongs),
      user_id: summary.userId,
      user_created_at: summary.userCreatedAt.toISOString(),
      recent_syncs: mapRecentSync()
    }
  }
}