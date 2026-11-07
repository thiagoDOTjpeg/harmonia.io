import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ILogger } from "@/application/ports/logger/ILogger";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "@/application/repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "@/application/repositories/ITrackRepository";
import { SyncYouTubePlaylistToSpotifyUseCase } from "@/application/use_cases/sync/SyncYouTubePlaylistToSpotifyUseCase";
import { PlaylistTrack } from "@/domain/entities/PlaylistTrack";
import { SyncedPlaylist } from "@/domain/entities/SyncedPlaylist";
import { Track } from "@/domain/entities/Track";
import { SyncPlaylistJobData } from "@/types/sync-job";

describe("SyncYouTubePlaylistToSpotifyUseCase", () => {
  let useCase: SyncYouTubePlaylistToSpotifyUseCase;
  let mockPlaylistRepo: jest.Mocked<IPlaylistRepository>;
  let mockTrackRepo: jest.Mocked<ITrackRepository>;
  let mockPlaylistTrackRepo: jest.Mocked<IPlaylistTrackRepository>;
  let mockGoogleClient: jest.Mocked<IGoogleMusicClient>;
  let mockSpotifyClient: jest.Mocked<ISpotifyMusicClient>;
  let mockLogger: jest.Mocked<ILogger>;

  const baseJobData: SyncPlaylistJobData = {
    playlistId: "playlist-db-1",
    userId: "user-123",
    youtubePlaylistId: "yt-playlist-123",
    googleAccessToken: "google-token",
    spotifyAccessToken: "spotify-token",
    spotifyUserId: "spotify-user-123",
  };

  const createTrackEntity = (
    overrides: Partial<{
      id: string;
      youtubeVideoId: string;
      youtubeTitle: string;
      youtubeChannel: string | null;
      spotifyTrackId: string | null;
      spotifyUri: string | null;
      spotifyArtist: string | null;
      spotifyAlbum: string | null;
      matchScore: number;
    }> = {},
  ): Track =>
    new Track(
      overrides.id ?? "track-1",
      overrides.youtubeVideoId ?? "vid-1",
      overrides.youtubeTitle ?? "Artist - Song 1",
      overrides.youtubeChannel ?? "ArtistVEVO",
      overrides.spotifyTrackId ?? null,
      overrides.spotifyUri ?? null,
      overrides.spotifyArtist ?? null,
      overrides.spotifyAlbum ?? null,
      overrides.matchScore ?? 0,
      overrides.spotifyTrackId ? new Date() : null,
      overrides.spotifyTrackId ? "auto" : null,
      false,
      false,
      false,
      null,
      new Date(),
      new Date(),
    );

  const createSyncedPlaylistEntity = (
    overrides: Partial<SyncedPlaylist> = {},
  ): SyncedPlaylist =>
    new SyncedPlaylist(
      overrides.id ?? "playlist-db-1",
      overrides.userId ?? "user-123",
      overrides.youtubePlaylistId ?? "yt-playlist-123",
      overrides.youtubeUrl ??
        "https://www.youtube.com/playlist?list=yt-playlist-123",
      overrides.youtubeTitle ?? "My YouTube Playlist",
      overrides.spotifyPlaylistId ?? "sp-playlist-123",
      overrides.spotifyUrl ?? "https://open.spotify.com/playlist/sp-playlist-123",
      overrides.spotifyTitle ?? "My YouTube Playlist",
      overrides.syncStatus ?? "pending",
      overrides.lastSyncedAt ?? null,
      new Date(),
      new Date(),
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockPlaylistRepo = {
      findByYoutubePlaylistId: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      updateSyncStatus: jest.fn(),
      delete: jest.fn(),
    };

    mockTrackRepo = {
      findByYoutubeVideoId: jest.fn(),
      create: jest.fn(),
      findManyByYoutubeIds: jest.fn(),
      updateSpotifyMatch: jest.fn(),
    };

    mockPlaylistTrackRepo = {
      findByPlaylistId: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      existsInPlaylist: jest.fn(),
    };

    mockGoogleClient = {
      getPlaylistInfo: jest.fn(),
      getPlaylistItems: jest.fn(),
    };

    mockSpotifyClient = {
      searchTrack: jest.fn(),
      addTracksToPlaylist: jest.fn(),
      createPlaylist: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      child: jest.fn().mockReturnThis(),
    };

    useCase = new SyncYouTubePlaylistToSpotifyUseCase(
      mockPlaylistRepo,
      mockTrackRepo,
      mockPlaylistTrackRepo,
      mockGoogleClient,
      mockSpotifyClient,
      mockLogger,
    );
  });

  it("should complete full sync flow: fetch from YouTube, search on Spotify, create playlist, and add tracks", async () => {
    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-playlist-123",
      title: "Rock Classics",
      channelTile: "MyChannel",
      description: "Best rock songs",
      itemCount: 2,
    });

    mockGoogleClient.getPlaylistItems.mockResolvedValue([
      {
        videoId: "vid-1",
        title: "Queen - Bohemian Rhapsody",
        channelTitle: "Queen Official",
        videoOwnerChannelTitle: "Queen Official",
      },
      {
        videoId: "vid-2",
        title: "Nirvana - Smells Like Teen Spirit",
        channelTitle: "NirvanaVEVO",
        videoOwnerChannelTitle: "NirvanaVEVO",
      },
    ]);

    mockTrackRepo.findManyByYoutubeIds.mockResolvedValue([]);
    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(null);
    mockSpotifyClient.createPlaylist.mockResolvedValue("sp-playlist-123");
    mockPlaylistRepo.create.mockResolvedValue(createSyncedPlaylistEntity());
    mockPlaylistTrackRepo.findByPlaylistId.mockResolvedValue([]);

    mockTrackRepo.create.mockImplementation(async (input) =>
      createTrackEntity({
        id: `db-${input.youtubeVideoId}`,
        youtubeVideoId: input.youtubeVideoId,
        youtubeTitle: input.youtubeTitle,
        youtubeChannel: input.youtubeChannel,
      }),
    );

    mockSpotifyClient.searchTrack
      .mockResolvedValueOnce({
        trackId: "sp-track-1",
        uri: "spotify:track:1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        matchScore: 0.95,
      })
      .mockResolvedValueOnce({
        trackId: "sp-track-2",
        uri: "spotify:track:2",
        name: "Smells Like Teen Spirit",
        artist: "Nirvana",
        album: "Nevermind",
        matchScore: 0.92,
      });

    mockTrackRepo.updateSpotifyMatch.mockImplementation(
      async (trackId, match) =>
        createTrackEntity({
          id: trackId,
          spotifyTrackId: match.spotifyTrackId,
          spotifyUri: match.spotifyUri,
          spotifyArtist: match.spotifyArtist,
          spotifyAlbum: match.spotifyAlbum,
          matchScore: match.matchScore,
        }),
    );

    const result = await useCase.execute(baseJobData);

    expect(mockSpotifyClient.createPlaylist).toHaveBeenCalledWith(
      "Rock Classics",
      "spotify-token",
      "spotify-user-123",
      "Synced from YouTube • Best rock songs",
    );
    expect(mockPlaylistRepo.create).toHaveBeenCalledTimes(1);
    expect(mockSpotifyClient.addTracksToPlaylist).toHaveBeenCalledWith(
      "sp-playlist-123",
      ["spotify:track:1", "spotify:track:2"],
      "spotify-token",
      "spotify-user-123",
    );
    expect(mockPlaylistRepo.updateSyncStatus).toHaveBeenCalledWith(
      "playlist-db-1",
      expect.objectContaining({ status: "completed" }),
    );
    expect(result).toMatchObject({
      playlistId: "playlist-db-1",
      totalTracks: 2,
      syncedTracks: 2,
      failedTracks: 0,
      newTracks: 2,
      duplicates: 0,
      status: "completed",
    });
  });

  it("should mark status as partial when some tracks are not found on Spotify", async () => {
    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-playlist-123",
      title: "Mixed Playlist",
      channelTile: "MyChannel",
      description: "",
      itemCount: 2,
    });

    mockGoogleClient.getPlaylistItems.mockResolvedValue([
      {
        videoId: "vid-1",
        title: "Known Song",
        channelTitle: "Artist",
        videoOwnerChannelTitle: "Artist",
      },
      {
        videoId: "vid-2",
        title: "Obscure Unreleased Remix 2007",
        channelTitle: "RandomUser",
        videoOwnerChannelTitle: "RandomUser",
      },
    ]);

    mockTrackRepo.findManyByYoutubeIds.mockResolvedValue([]);
    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(
      createSyncedPlaylistEntity(),
    );
    mockPlaylistTrackRepo.findByPlaylistId.mockResolvedValue([]);

    mockTrackRepo.create.mockImplementation(async (input) =>
      createTrackEntity({
        id: `db-${input.youtubeVideoId}`,
        youtubeVideoId: input.youtubeVideoId,
        youtubeTitle: input.youtubeTitle,
      }),
    );

    mockSpotifyClient.searchTrack
      .mockResolvedValueOnce({
        trackId: "sp-track-1",
        uri: "spotify:track:1",
        name: "Known Song",
        artist: "Artist",
        album: "Album",
        matchScore: 0.9,
      })
      .mockResolvedValueOnce(null);

    mockTrackRepo.updateSpotifyMatch.mockImplementation(
      async (trackId, match) =>
        createTrackEntity({
          id: trackId,
          spotifyTrackId: match.spotifyTrackId,
          spotifyUri: match.spotifyUri,
          matchScore: match.matchScore,
        }),
    );

    const result = await useCase.execute(baseJobData);

    expect(mockSpotifyClient.createPlaylist).not.toHaveBeenCalled();
    expect(mockSpotifyClient.addTracksToPlaylist).toHaveBeenCalledWith(
      "sp-playlist-123",
      ["spotify:track:1"],
      "spotify-token",
      "spotify-user-123",
    );
    expect(mockPlaylistRepo.updateSyncStatus).toHaveBeenCalledWith(
      "playlist-db-1",
      expect.objectContaining({ status: "partial" }),
    );
    expect(result).toMatchObject({
      totalTracks: 2,
      syncedTracks: 1,
      failedTracks: 1,
      status: "partial",
    });
  });

  it("should mark status as failed when all tracks fail to match on Spotify", async () => {
    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-playlist-123",
      title: "Unmatchable Playlist",
      channelTile: "MyChannel",
      description: "",
      itemCount: 1,
    });

    mockGoogleClient.getPlaylistItems.mockResolvedValue([
      {
        videoId: "vid-1",
        title: "Non-music video",
        channelTitle: "Vlog",
        videoOwnerChannelTitle: "Vlog",
      },
    ]);

    mockTrackRepo.findManyByYoutubeIds.mockResolvedValue([]);
    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(
      createSyncedPlaylistEntity(),
    );
    mockPlaylistTrackRepo.findByPlaylistId.mockResolvedValue([]);
    mockTrackRepo.create.mockResolvedValue(createTrackEntity());
    mockSpotifyClient.searchTrack.mockResolvedValue(null);

    const result = await useCase.execute(baseJobData);

    expect(mockSpotifyClient.addTracksToPlaylist).not.toHaveBeenCalled();
    expect(mockPlaylistRepo.updateSyncStatus).toHaveBeenCalledWith(
      "playlist-db-1",
      expect.objectContaining({ status: "failed" }),
    );
    expect(result).toMatchObject({
      totalTracks: 1,
      syncedTracks: 0,
      failedTracks: 1,
      status: "failed",
    });
  });

  it("should handle duplicate Spotify matches by selecting the best video and incrementing duplicateCount", async () => {
    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-playlist-123",
      title: "Duplicates Playlist",
      channelTile: "MyChannel",
      description: "",
      itemCount: 2,
    });

    mockGoogleClient.getPlaylistItems.mockResolvedValue([
      {
        videoId: "vid-reupload",
        title: "Song Title (Lyrics)",
        channelTitle: "FanChannel",
        videoOwnerChannelTitle: "FanChannel",
      },
      {
        videoId: "vid-official",
        title: "Song Title (Official Video)",
        channelTitle: "ArtistVEVO",
        videoOwnerChannelTitle: "ArtistVEVO",
      },
    ]);

    mockTrackRepo.findManyByYoutubeIds.mockResolvedValue([]);
    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(
      createSyncedPlaylistEntity(),
    );
    mockPlaylistTrackRepo.findByPlaylistId.mockResolvedValue([]);

    mockTrackRepo.create.mockImplementation(async (input) =>
      createTrackEntity({
        id: `db-${input.youtubeVideoId}`,
        youtubeVideoId: input.youtubeVideoId,
        youtubeTitle: input.youtubeTitle,
      }),
    );

    mockSpotifyClient.searchTrack.mockResolvedValue({
      trackId: "sp-same-track",
      uri: "spotify:track:same",
      name: "Song Title",
      artist: "Artist",
      album: "Album",
      matchScore: 0.95,
    });

    mockTrackRepo.updateSpotifyMatch.mockImplementation(
      async (trackId, match) =>
        createTrackEntity({
          id: trackId,
          spotifyTrackId: match.spotifyTrackId,
          spotifyUri: match.spotifyUri,
          matchScore: match.matchScore,
        }),
    );

    const result = await useCase.execute(baseJobData);

    expect(result.duplicates).toBe(1);
    expect(result.syncedTracks).toBe(1);
    expect(mockSpotifyClient.addTracksToPlaylist).toHaveBeenCalledWith(
      "sp-playlist-123",
      ["spotify:track:same"],
      "spotify-token",
      "spotify-user-123",
    );
  });

  it("should handle API rate limits and batching (>100 tracks) gracefully", async () => {
    const videos = Array.from({ length: 120 }, (_, i) => ({
      videoId: `vid-${i}`,
      title: `Song ${i}`,
      channelTitle: "Channel",
      videoOwnerChannelTitle: "Channel",
    }));

    const existingTracks = videos.map((v, i) =>
      createTrackEntity({
        id: `db-${i}`,
        youtubeVideoId: v.videoId,
        youtubeTitle: v.title,
        spotifyTrackId: `sp-${i}`,
        spotifyUri: `spotify:track:${i}`,
        matchScore: 0.9,
      }),
    );

    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-playlist-123",
      title: "Large Playlist",
      channelTile: "Channel",
      description: "",
      itemCount: 120,
    });
    mockGoogleClient.getPlaylistItems.mockResolvedValue(videos);
    mockTrackRepo.findManyByYoutubeIds.mockResolvedValue(existingTracks);
    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(
      createSyncedPlaylistEntity(),
    );
    mockPlaylistTrackRepo.findByPlaylistId.mockResolvedValue(
      [] as PlaylistTrack[],
    );

    // First batch of 100 throws rate limit error, second batch of 20 succeeds
    mockSpotifyClient.addTracksToPlaylist
      .mockRejectedValueOnce(new Error("429 Too Many Requests"))
      .mockResolvedValueOnce(undefined);

    const result = await useCase.execute(baseJobData);

    expect(mockSpotifyClient.addTracksToPlaylist).toHaveBeenCalledTimes(2);
    expect(
      mockSpotifyClient.addTracksToPlaylist.mock.calls[0][1],
    ).toHaveLength(100);
    expect(
      mockSpotifyClient.addTracksToPlaylist.mock.calls[1][1],
    ).toHaveLength(20);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Error) }),
      expect.stringContaining("Occurred an error on the batching add"),
    );
    expect(result.status).toBe("completed");
  });

  it("should log critical error and rethrow when fetching YouTube playlist info fails", async () => {
    const apiError = new Error("YouTube API Quota Exceeded");
    mockGoogleClient.getPlaylistInfo.mockRejectedValue(apiError);

    await expect(useCase.execute(baseJobData)).rejects.toThrow(
      "YouTube API Quota Exceeded",
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: apiError },
      "CRITICAL: Sync failed",
    );
  });
});

