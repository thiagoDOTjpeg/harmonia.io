/*
  Warnings:

  - You are about to drop the `synced_tracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."synced_tracks" DROP CONSTRAINT "synced_tracks_playlistId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."synced_tracks";

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "youtubeTitle" TEXT NOT NULL,
    "youtubeChannel" TEXT,
    "spotifyTrackId" TEXT,
    "spotifyUri" TEXT,
    "spotifyArtist" TEXT,
    "spotifyAlbum" TEXT,
    "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matchedAt" TIMESTAMP(3),
    "matchSource" TEXT,
    "isOfficialVideo" BOOLEAN NOT NULL DEFAULT false,
    "isVisualizer" BOOLEAN NOT NULL DEFAULT false,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER,

    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_youtubeVideoId_key" ON "tracks"("youtubeVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotifyTrackId_key" ON "tracks"("spotifyTrackId");

-- CreateIndex
CREATE INDEX "tracks_youtubeVideoId_idx" ON "tracks"("youtubeVideoId");

-- CreateIndex
CREATE INDEX "tracks_spotifyTrackId_idx" ON "tracks"("spotifyTrackId");

-- CreateIndex
CREATE INDEX "playlist_tracks_playlistId_idx" ON "playlist_tracks"("playlistId");

-- CreateIndex
CREATE INDEX "playlist_tracks_trackId_idx" ON "playlist_tracks"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_playlistId_trackId_key" ON "playlist_tracks"("playlistId", "trackId");

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "synced_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
