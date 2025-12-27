-- CreateEnum
CREATE TYPE "ServiceProvider" AS ENUM ('google', 'spotify');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "password_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email_verified_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synced_playlists" (
    "id" TEXT NOT NULL,
    "youtube_playlist_id" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "youtube_title" TEXT,
    "spotify_playlist_id" TEXT NOT NULL,
    "spotify_url" TEXT NOT NULL,
    "spotify_title" TEXT,
    "last_synced_at" TIMESTAMP(3),
    "sync_status" TEXT NOT NULL DEFAULT 'pending',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "synced_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "youtube_video_id" TEXT NOT NULL,
    "youtube_title" TEXT NOT NULL,
    "youtube_channel" TEXT,
    "spotify_track_id" TEXT,
    "spotify_uri" TEXT,
    "spotify_artist" TEXT,
    "spotify_album" TEXT,
    "match_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matched_at" TIMESTAMP(3),
    "match_source" TEXT,
    "is_official_video" BOOLEAN NOT NULL DEFAULT false,
    "is_visualizer" BOOLEAN NOT NULL DEFAULT false,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "ai_confidence" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER,

    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "ServiceProvider" NOT NULL,
    "provider_account_id" TEXT,
    "email" TEXT,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "scopes" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "synced_playlists_user_id_idx" ON "synced_playlists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "synced_playlists_user_id_youtube_playlist_id_key" ON "synced_playlists"("user_id", "youtube_playlist_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_youtube_video_id_key" ON "tracks"("youtube_video_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotify_track_id_key" ON "tracks"("spotify_track_id");

-- CreateIndex
CREATE INDEX "tracks_youtube_video_id_idx" ON "tracks"("youtube_video_id");

-- CreateIndex
CREATE INDEX "tracks_spotify_track_id_idx" ON "tracks"("spotify_track_id");

-- CreateIndex
CREATE INDEX "playlist_tracks_playlist_id_idx" ON "playlist_tracks"("playlist_id");

-- CreateIndex
CREATE INDEX "playlist_tracks_track_id_idx" ON "playlist_tracks"("track_id");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_playlist_id_track_id_key" ON "playlist_tracks"("playlist_id", "track_id");

-- CreateIndex
CREATE UNIQUE INDEX "services_connections_provider_account_id_key" ON "services_connections"("provider_account_id");

-- AddForeignKey
ALTER TABLE "synced_playlists" ADD CONSTRAINT "synced_playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "synced_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_connections" ADD CONSTRAINT "services_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
