-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "spotifyId" TEXT,
    "spotifyAccessToken" TEXT,
    "spotifyRefreshToken" TEXT,
    "spotifyTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synced_playlists" (
    "id" TEXT NOT NULL,
    "youtubePlaylistId" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "youtubeTitle" TEXT,
    "spotifyPlaylistId" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "spotifyTitle" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "synced_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synced_tracks" (
    "id" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "youtubeTitle" TEXT NOT NULL,
    "spotifyTrackId" TEXT,
    "spotifyUri" TEXT,
    "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "playlistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "synced_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_spotifyId_key" ON "users"("spotifyId");

-- CreateIndex
CREATE INDEX "synced_playlists_userId_idx" ON "synced_playlists"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "synced_playlists_userId_youtubePlaylistId_key" ON "synced_playlists"("userId", "youtubePlaylistId");

-- CreateIndex
CREATE UNIQUE INDEX "synced_tracks_playlistId_youtubeVideoId_key" ON "synced_tracks"("playlistId", "youtubeVideoId");

-- AddForeignKey
ALTER TABLE "synced_playlists" ADD CONSTRAINT "synced_playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synced_tracks" ADD CONSTRAINT "synced_tracks_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "synced_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
