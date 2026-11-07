import { ILogger } from "@/application/ports/logger/ILogger";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { IPlaylistRepository } from "@/application/repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "@/application/repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "@/application/repositories/ITrackRepository";
import { DeletePlaylistUseCase } from "@/application/use_cases/playlist/DeletePlaylistUseCase";
import { GetPlaylistDetailsUseCase } from "@/application/use_cases/playlist/GetPlaylistDetailsUseCase";
import { GetTrackCandidatesUseCase } from "@/application/use_cases/playlist/GetTrackCandidatesUseCase";
import { ManualMatchTrackUseCase } from "@/application/use_cases/playlist/ManualMatchTrackUseCase";
import { PlaylistTrack } from "@/domain/entities/PlaylistTrack";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { Track } from "@/domain/entities/Track";
import { NotFoundError, ServiceProvider } from "@harmonia/shared";

describe("Playlist Management Use Cases", () => {
  let mockPlaylistRepo: jest.Mocked<Required<IPlaylistRepository>>;
  let mockTrackRepo: jest.Mocked<Required<ITrackRepository>>;
  let mockPlaylistTrackRepo: jest.Mocked<Required<IPlaylistTrackRepository>>;
  let mockSpotifyClient: jest.Mocked<Required<ISpotifyMusicClient>>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPlaylistRepo = {
      findById: jest.fn(),
      findByIdWithTracks: jest.fn(),
      findByYoutubePlaylistId: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      updateSyncStatus: jest.fn(),
      delete: jest.fn(),
    };

    mockTrackRepo = {
      findById: jest.fn(),
      findByYoutubeVideoId: jest.fn(),
      create: jest.fn(),
      findManyByYoutubeIds: jest.fn(),
      updateSpotifyMatch: jest.fn(),
    };

    mockPlaylistTrackRepo = {
      findByPlaylistId: jest.fn(),
      findByPlaylistAndTrackId: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      existsInPlaylist: jest.fn(),
    };

    mockSpotifyClient = {
      searchTrack: jest.fn(),
      searchCandidates: jest.fn(),
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
  });

  describe("GetPlaylistDetailsUseCase", () => {
    it("should return playlist details and track stats when owned by user", async () => {
      const useCase = new GetPlaylistDetailsUseCase(mockPlaylistRepo);

      mockPlaylistRepo.findByIdWithTracks!.mockResolvedValue({
        id: "pl-1",
        userId: "user-1",
        youtubePlaylistId: "yt-pl-1",
        youtubeUrl: "https://youtube.com/playlist?list=yt-pl-1",
        youtubeTitle: "Rock Hits",
        spotifyPlaylistId: "sp-pl-1",
        spotifyUrl: "https://open.spotify.com/playlist/sp-pl-1",
        spotifyTitle: "Rock Hits",
        syncStatus: "partial",
        lastSyncedAt: new Date("2026-01-01T00:00:00Z"),
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
        playlistTracks: [
          {
            id: "pt-1",
            position: 0,
            status: "synced",
            addedAt: new Date("2026-01-01T00:00:00Z"),
            track: {
              id: "t-1",
              youtubeVideoId: "vid-1",
              youtubeTitle: "Queen - Bohemian Rhapsody",
              youtubeChannel: "Queen Official",
              spotifyTrackId: "sp-t-1",
              spotifyUri: "spotify:track:sp-t-1",
              spotifyArtist: "Queen",
              spotifyAlbum: "A Night at the Opera",
              matchScore: 0.95,
              matchedAt: new Date("2026-01-01T00:00:00Z"),
              matchSource: "auto",
            },
          },
          {
            id: "pt-2",
            position: 1,
            status: "failed",
            addedAt: new Date("2026-01-01T00:00:00Z"),
            track: {
              id: "t-2",
              youtubeVideoId: "vid-2",
              youtubeTitle: "Rare Underground Track",
              youtubeChannel: "Unknown Channel",
              spotifyTrackId: null,
              spotifyUri: null,
              spotifyArtist: null,
              spotifyAlbum: null,
              matchScore: 0,
              matchedAt: null,
              matchSource: null,
            },
          },
        ],
      });

      const result = await useCase.execute("pl-1", "user-1");

      expect(result.id).toBe("pl-1");
      expect(result.stats).toEqual({
        total: 2,
        synced: 1,
        pending: 0,
        failed: 1,
        low_confidence: 0,
      });
      expect(result.tracks).toHaveLength(2);
      expect(result.tracks[0].status).toBe("synced");
      expect(result.tracks[1].status).toBe("failed");
    });

    it("should throw NotFoundError if playlist belongs to another user", async () => {
      const useCase = new GetPlaylistDetailsUseCase(mockPlaylistRepo);

      mockPlaylistRepo.findByIdWithTracks!.mockResolvedValue({
        id: "pl-1",
        userId: "other-user",
        playlistTracks: [],
      });

      await expect(useCase.execute("pl-1", "user-1")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("GetTrackCandidatesUseCase", () => {
    it("should fetch Spotify candidates for a track", async () => {
      const useCase = new GetTrackCandidatesUseCase(
        mockPlaylistRepo,
        mockTrackRepo,
        mockSpotifyClient
      );

      mockPlaylistRepo.findById!.mockResolvedValue({
        id: "pl-1",
        userId: "user-1",
      } as any);

      mockTrackRepo.findById!.mockResolvedValue(
        new Track(
          "t-2",
          "vid-2",
          "Linkin Park - Numb",
          "Linkin Park",
          null,
          null,
          null,
          null,
          0,
          null,
          null,
          false,
          false,
          false,
          null,
          new Date(),
          new Date()
        )
      );

      mockSpotifyClient.searchCandidates!.mockResolvedValue([
        {
          trackId: "sp-numb",
          uri: "spotify:track:sp-numb",
          name: "Numb",
          artist: "Linkin Park",
          album: "Meteora",
          imageUrl: null,
          durationMs: 185000,
          externalUrl: "https://open.spotify.com/track/sp-numb",
          matchScore: 0.98,
        },
      ]);

      const connections = new Map<ServiceProvider, ServiceConnection>([
        [
          ServiceProvider.SPOTIFY,
          new ServiceConnection(
            "conn-1",
            "user-1",
            ServiceProvider.SPOTIFY,
            "sp-user-1",
            "user@test.com",
            "sp-access-token",
            new Date(),
            "scopes",
            null,
            new Date(),
            new Date(),
            "sp-refresh-token"
          ),
        ],
      ]);

      const result = await useCase.execute({
        playlistId: "pl-1",
        trackId: "t-2",
        userId: "user-1",
        connections,
      });

      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0].trackId).toBe("sp-numb");
      expect(mockSpotifyClient.searchCandidates).toHaveBeenCalledWith(
        expect.objectContaining({
          youtubeTitle: "Linkin Park - Numb",
          channelTitle: "Linkin Park",
        }),
        "sp-access-token"
      );
    });
  });

  describe("ManualMatchTrackUseCase", () => {
    it("should save manual match in DB and immediately sync to Spotify when syncNow is true", async () => {
      const useCase = new ManualMatchTrackUseCase(
        mockPlaylistRepo,
        mockTrackRepo,
        mockPlaylistTrackRepo,
        mockSpotifyClient,
        mockLogger
      );

      mockPlaylistRepo
        .findByIdWithTracks!.mockResolvedValueOnce({
          id: "pl-1",
          userId: "user-1",
          spotifyPlaylistId: "sp-pl-1",
          syncStatus: "partial",
          lastSyncedAt: new Date(),
          playlistTracks: [],
        })
        .mockResolvedValueOnce({
          id: "pl-1",
          userId: "user-1",
          spotifyPlaylistId: "sp-pl-1",
          syncStatus: "partial",
          lastSyncedAt: new Date(),
          playlistTracks: [
            {
              id: "pt-2",
              status: "synced",
              track: {
                id: "t-2",
                spotifyTrackId: "sp-numb",
                matchSource: "manual",
              },
            },
          ],
        });

      mockTrackRepo.findById!.mockResolvedValue(
        new Track(
          "t-2",
          "vid-2",
          "Linkin Park - Numb",
          "Linkin Park",
          null,
          null,
          null,
          null,
          0,
          null,
          null,
          false,
          false,
          false,
          null,
          new Date(),
          new Date()
        )
      );

      mockPlaylistTrackRepo.findByPlaylistAndTrackId!.mockResolvedValue(
        new PlaylistTrack("pt-2", "pl-1", "t-2", "failed", new Date(), 1)
      );

      mockTrackRepo.updateSpotifyMatch.mockResolvedValue(
        new Track(
          "t-2",
          "vid-2",
          "Linkin Park - Numb",
          "Linkin Park",
          "sp-numb",
          "spotify:track:sp-numb",
          "Numb — Linkin Park",
          "Meteora",
          1.0,
          new Date(),
          "manual",
          false,
          false,
          false,
          null,
          new Date(),
          new Date()
        )
      );

      const connections = new Map<ServiceProvider, ServiceConnection>([
        [
          ServiceProvider.SPOTIFY,
          new ServiceConnection(
            "conn-1",
            "user-1",
            ServiceProvider.SPOTIFY,
            "sp-user-1",
            "user@test.com",
            "sp-access-token",
            new Date(),
            "scopes",
            null,
            new Date(),
            new Date(),
            "sp-refresh-token"
          ),
        ],
      ]);

      const result = await useCase.execute({
        playlistId: "pl-1",
        trackId: "t-2",
        userId: "user-1",
        spotifyTrackId: "sp-numb",
        spotifyUri: "spotify:track:sp-numb",
        spotifyArtist: "Numb — Linkin Park",
        spotifyAlbum: "Meteora",
        syncNow: true,
        connections,
      });

      expect(mockTrackRepo.updateSpotifyMatch).toHaveBeenCalledWith("t-2", {
        spotifyTrackId: "sp-numb",
        spotifyUri: "spotify:track:sp-numb",
        spotifyArtist: "Numb — Linkin Park",
        spotifyAlbum: "Meteora",
        matchScore: 1.0,
        matchSource: "manual",
      });
      expect(mockSpotifyClient.addTracksToPlaylist).toHaveBeenCalledWith(
        "sp-pl-1",
        ["spotify:track:sp-numb"],
        "sp-access-token",
        "sp-user-1"
      );
      expect(mockPlaylistTrackRepo.updateStatus).toHaveBeenCalledWith(
        "pt-2",
        "synced"
      );
      expect(mockPlaylistRepo.updateSyncStatus).toHaveBeenCalledWith(
        "pl-1",
        expect.objectContaining({ status: "completed" })
      );
      expect(result.syncedToSpotify).toBe(true);
      expect(result.playlistTrackStatus).toBe("synced");
    });
  });

  describe("DeletePlaylistUseCase", () => {
    it("should delete playlist when owned by user", async () => {
      const useCase = new DeletePlaylistUseCase(mockPlaylistRepo);

      mockPlaylistRepo.findById!.mockResolvedValue({
        id: "pl-1",
        userId: "user-1",
      } as any);

      await useCase.execute("pl-1", "user-1");

      expect(mockPlaylistRepo.delete).toHaveBeenCalledWith("pl-1");
    });
  });
});
