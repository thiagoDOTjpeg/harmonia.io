import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ILogger } from "@/application/ports/logger/ILogger";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { StartYoutubePlaylistToSpotifySyncUseCase } from "@/application/use_cases/sync/StartYoutubePlaylistToSpotifySyncUseCase";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { SyncedPlaylist } from "@/domain/entities/SyncedPlaylist";
import { PlaylistSyncQueue } from "@/infrastructure/queue/PlaylistSyncQueue";
import { ERRORS } from "@/types/constant/errors";
import { PlaylistLimitExceededError, ServiceProvider } from "@harmonia/shared";

describe("StartYoutubePlaylistToSpotifySyncUseCase", () => {
  let useCase: StartYoutubePlaylistToSpotifySyncUseCase;
  let mockSyncQueue: jest.Mocked<PlaylistSyncQueue>;
  let mockPlaylistRepo: jest.Mocked<IPlaylistRepository>;
  let mockGoogleClient: jest.Mocked<IGoogleMusicClient>;
  let mockLogger: jest.Mocked<ILogger>;

  const createConnection = (
    provider: ServiceProvider,
    accessToken: string,
    providerAccountId = "acc-123",
  ): ServiceConnection =>
    new ServiceConnection(
      `conn-${provider}`,
      "user-123",
      provider,
      providerAccountId,
      "user@example.com",
      accessToken,
      new Date(),
      "scopes",
      null,
      new Date(),
      new Date(),
      "refresh",
    );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PLAYLIST_MAX_SONGS = "100";

    mockSyncQueue = {
      addSyncJob: jest.fn(),
    } as unknown as jest.Mocked<PlaylistSyncQueue>;

    mockPlaylistRepo = {
      findByYoutubePlaylistId: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      updateSyncStatus: jest.fn(),
      delete: jest.fn(),
    };

    mockGoogleClient = {
      getPlaylistInfo: jest.fn(),
      getPlaylistItems: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      child: jest.fn().mockReturnThis(),
    };

    useCase = new StartYoutubePlaylistToSpotifySyncUseCase(
      mockSyncQueue,
      mockPlaylistRepo,
      mockGoogleClient,
      mockLogger,
    );
  });

  it("should throw SERVICE_CONNECTIONS_NOT_ACTIVE when Google or Spotify connection is missing", async () => {
    const connections = new Map<ServiceProvider, ServiceConnection>();
    connections.set(
      ServiceProvider.GOOGLE,
      createConnection(ServiceProvider.GOOGLE, "g-token"),
    );

    await expect(
      useCase.execute({
        connections,
        userId: "user-123",
        youtubePlaylistId: "yt-123",
      }),
    ).rejects.toThrow(ERRORS.SERVICE_CONNECTIONS_NOT_ACTIVE);
  });

  it("should throw PlaylistLimitExceededError when playlist exceeds PLAYLIST_MAX_SONGS", async () => {
    const connections = new Map<ServiceProvider, ServiceConnection>([
      [
        ServiceProvider.GOOGLE,
        createConnection(ServiceProvider.GOOGLE, "g-token"),
      ],
      [
        ServiceProvider.SPOTIFY,
        createConnection(ServiceProvider.SPOTIFY, "sp-token"),
      ],
    ]);

    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-123",
      title: "Huge Playlist",
      channelTile: "Channel",
      description: "",
      itemCount: 150,
    });

    await expect(
      useCase.execute({
        connections,
        userId: "user-123",
        youtubePlaylistId: "yt-123",
      }),
    ).rejects.toThrow(PlaylistLimitExceededError);

    expect(mockSyncQueue.addSyncJob).not.toHaveBeenCalled();
  });

  it("should enqueue sync job and return pending status when connections and playlist are valid", async () => {
    const connections = new Map<ServiceProvider, ServiceConnection>([
      [
        ServiceProvider.GOOGLE,
        createConnection(ServiceProvider.GOOGLE, "g-token"),
      ],
      [
        ServiceProvider.SPOTIFY,
        createConnection(
          ServiceProvider.SPOTIFY,
          "sp-token",
          "spotify-user-id",
        ),
      ],
    ]);

    mockGoogleClient.getPlaylistInfo.mockResolvedValue({
      id: "yt-123",
      title: "Valid Playlist",
      channelTile: "Channel",
      description: "",
      itemCount: 25,
    });

    mockPlaylistRepo.findByYoutubePlaylistId.mockResolvedValue(
      new SyncedPlaylist(
        "playlist-db-1",
        "user-123",
        "yt-123",
        "url",
        "Valid Playlist",
        "sp-123",
        "sp-url",
        "Valid Playlist",
        "completed",
        new Date(),
        new Date(),
        new Date(),
      ),
    );

    mockSyncQueue.addSyncJob.mockResolvedValue({ id: "job-999" } as any);

    const result = await useCase.execute({
      connections,
      userId: "user-123",
      youtubePlaylistId: "yt-123",
    });

    expect(mockSyncQueue.addSyncJob).toHaveBeenCalledWith({
      playlistId: "playlist-db-1",
      userId: "user-123",
      youtubePlaylistId: "yt-123",
      googleAccessToken: "g-token",
      spotifyAccessToken: "sp-token",
      spotifyUserId: "spotify-user-id",
      priority: 10,
    });

    expect(result).toEqual({
      jobId: "job-999",
      playlistId: "playlist-db-1",
      status: "pending",
      message: "Sincronização iniciada. Use /sync/status/:jobId para acompanhar",
    });
  });
});

