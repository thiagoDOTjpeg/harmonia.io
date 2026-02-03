import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { ILogger } from "@/infrastructure/logger";
import { SyncPlaylistJobData } from "@/types/sync-job";
import { IPlaylistRepository } from "../../repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "../../repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "../../repositories/ITrackRepository";

type SyncMusic = {

}

export class SyncYouTubePlaylistToSpotifyUseCase {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly playlistTrackRepository: IPlaylistTrackRepository,
    private readonly googleMusicClient: IGoogleMusicClient,
    private readonly spotifyMusicClient: ISpotifyMusicClient,
    private readonly logger: ILogger,
  ) { }

  async execute(data: SyncPlaylistJobData) {
    const startTime = Date.now();
    const { googleAccessToken, playlistId, spotifyAccessToken, spotifyUserId, userId, youtubePlaylistId, priority } = data;

    this.logger.info({ playlistId: data.playlistId, userId: data.userId }, 'Starting playlist sync');

    try {
      const youtubePlaylist = await this.googleMusicClient.getPlaylistInfo(youtubePlaylistId, googleAccessToken);
      const youtubePlaylistVideos = await this.googleMusicClient.getPlaylistItems(playlistId, googleAccessToken);

      this.logger.info({ videoCount: youtubePlaylistVideos.length }, 'YouTube videos fetched');

      let playlistSynced = await this.playlistRepository.findByYoutubePlaylistId(userId, youtubePlaylistId);

      if (!playlistSynced) {
        const spotifyPlaylistId = await this.spotifyMusicClient.createPlaylist(
          youtubePlaylist.title, spotifyAccessToken, spotifyUserId,
          `Synced from YouTube • ${youtubePlaylist.description || 'Harmonia.io'}`
        )

        playlistSynced = await this.playlistRepository.create({
          spotifyPlaylistId: spotifyPlaylistId,
          spotifyTitle: youtubePlaylist.title,
          spotifyUrl: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
          userId,
          youtubePlaylistId,
          youtubeTitle: youtubePlaylist.title,
          youtubeUrl: `https://www.youtube.com/playlist?list=${data.youtubePlaylistId}`
        })
      }

      const existingPlaylistTrack = await this.playlistTrackRepository.findByPlaylistId(playlistSynced.id);

      let syncedCount = 0;
      let failedCount = 0;
      let duplicateCount = 0;
      let newTracksCount = 0;

      const tracksToProcess = new Map<string, SyncMusic>();

      for (let i = 0; i < youtubePlaylistVideos.length; i++) {
        const currentVideo = youtubePlaylistVideos[i];

        let track = await this.trackRepository.findByYoutubeVideoId(currentVideo.videoId);

        if (!track) {
          track = await this.trackRepository.create({
            youtubeChannel: currentVideo.channelTitle,
            youtubeTitle: currentVideo.title,
            youtubeVideoId: currentVideo.videoId
          })
        }



      }
    } catch (error) {

    }
  }
}