import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { logger } from "@/infrastructure/logger";
import { SyncPlaylistInput, SyncPlaylistResult } from "@/types/playlist";
import { IPlaylistRepository } from "../../repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "../../repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "../../repositories/ITrackRepository";

export class SyncYouTubePlaylistToSpotifyUseCase {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly playlistTrackRepository: IPlaylistTrackRepository,
    private readonly googleClient: IGoogleMusicClient,
    private readonly spotifyClient: ISpotifyMusicClient,
  ) { }

  async execute(input: SyncPlaylistInput): Promise<SyncPlaylistResult> {
    const youtubePlaylistInfo = await this.googleClient.getPlaylistInfo(
      input.youtubePlaylistId,
      input.googleAccessToken
    );

    const youtubeVideos = await this.googleClient.getPlaylistItems(
      input.youtubePlaylistId,
      input.googleAccessToken
    );

    logger.info({ videoCount: youtubeVideos.length }, 'YouTube videos fetched');

    let syncedPlaylist = await this.playlistRepository.findByYoutubePlaylistId(
      input.userId,
      input.youtubePlaylistId
    );

    if (!syncedPlaylist) {
      const spotifyPlaylistId = await this.spotifyClient.createPlaylist(
        youtubePlaylistInfo.title,
        `Synced from YouTube • ${youtubePlaylistInfo.description || 'Harmonia.io'}`
      );

      logger.info({ spotifyPlaylistId }, 'Spotify playlist created');

      syncedPlaylist = await this.playlistRepository.create({
        userId: input.userId,
        youtubePlaylistId: input.youtubePlaylistId,
        youtubeUrl: `https://www.youtube.com/playlist?list=${input.youtubePlaylistId}`,
        youtubeTitle: youtubePlaylistInfo.title,
        spotifyPlaylistId,
        spotifyUrl: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
        spotifyTitle: youtubePlaylistInfo.title,
      });
    } else {
      logger.info({ playlistId: syncedPlaylist.id }, 'Playlist exists, updating');
    }

    const existingPlaylistTracks = await this.playlistTrackRepository.findByPlaylistId(
      syncedPlaylist.id
    );
    const existingTrackIds = new Set(existingPlaylistTracks.map(pt => pt.trackId));

    let syncedCount = 0;
    let failedCount = 0;
    let newTracksCount = 0;
    const tracksToAdd: string[] = [];

    for (let i = 0; i < youtubeVideos.length; i++) {
      const video = youtubeVideos[i];

      try {
        logger.debug({ trackIndex: i + 1, totalTracks: youtubeVideos.length, videoTitle: video.title }, 'Processing track');

        let track = await this.trackRepository.findByYoutubeVideoId(video.videoId);

        if (!track) {
          track = await this.trackRepository.create({
            youtubeVideoId: video.videoId,
            youtubeTitle: video.title,
            youtubeChannel: video.channelTitle,
          });
        }

        if (!track.hasSpotifyMatch()) {
          const spotifyMatch = await this.spotifyClient.searchTrack(video.title, video.videoOwnerChannelTitle);

          if (spotifyMatch) {
            track = await this.trackRepository.updateSpotifyMatch(track.id, {
              spotifyTrackId: spotifyMatch.trackId,
              spotifyUri: spotifyMatch.uri,
              spotifyArtist: spotifyMatch.artist,
              spotifyAlbum: spotifyMatch.album,
              matchScore: spotifyMatch.matchScore,
              matchSource: 'auto',
            });
          } else {
            logger.warn({ videoTitle: video.title, videoId: video.videoId }, 'Match failed');
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          logger.debug({ spotifyArtist: track.spotifyArtist, spotifyTrackId: track.spotifyTrackId }, 'Reusing existing match');
        }

        const isNewInPlaylist = !existingTrackIds.has(track.id);

        if (isNewInPlaylist) {
          try {
            await this.playlistTrackRepository.create({
              playlistId: syncedPlaylist.id,
              trackId: track.id,
              position: i,
            });
            newTracksCount++;
          } catch (error: any) {
            if (!error.message?.includes('Unique constraint')) {
              throw error;
            }
            logger.debug({ trackId: track.id }, 'Track already exists in playlist (race condition)');
          }
        }

        if (track.hasSpotifyMatch() && track.spotifyUri && isNewInPlaylist) {
          tracksToAdd.push(track.spotifyUri);
          syncedCount++;
        } else if (!track.hasSpotifyMatch()) {
          failedCount++;
        }
      } catch (error) {
        logger.error({ err: error, videoId: video.videoId }, 'Error processing video');
        failedCount++;
      }
    }

    if (tracksToAdd.length > 0) {
      logger.info({ tracksToAdd: tracksToAdd.length }, 'Adding new tracks to Spotify');

      await this.spotifyClient.addTracksToPlaylist(
        syncedPlaylist.spotifyPlaylistId,
        tracksToAdd
      );

      logger.info({ addedTracks: tracksToAdd.length }, 'Tracks added to Spotify');
    } else {
      logger.info('No new tracks to add');
    }

    const finalStatus =
      failedCount === 0 ? 'completed' :
        failedCount === youtubeVideos.length ? 'failed' :
          'partial';

    await this.playlistRepository.updateSyncStatus(syncedPlaylist.id, {
      status: finalStatus,
      lastSyncedAt: new Date(),
    });

    logger.info({ syncedTracks: syncedCount, totalTracks: youtubeVideos.length, newTracks: newTracksCount }, 'Sync completed');

    return {
      playlistId: syncedPlaylist.id,
      totalTracks: youtubeVideos.length,
      syncedTracks: syncedCount,
      failedTracks: failedCount,
      newTracks: newTracksCount,
      status: finalStatus,
    };
  }
}