/*
  Warnings:

  - Added the required column `access_token_iv` to the `services_connections` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."idx_playlist_tracks_playlist";

-- DropIndex
DROP INDEX "public"."idx_services_connections_user_provider";

-- DropIndex
DROP INDEX "public"."idx_synced_playlists_last_sync";

-- DropIndex
DROP INDEX "public"."idx_synced_playlists_user";

-- AlterTable
ALTER TABLE "services_connections" ADD COLUMN     "access_token_iv" TEXT NOT NULL,
ADD COLUMN     "refresh_token_iv" TEXT;
