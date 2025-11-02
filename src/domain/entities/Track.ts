export class Track {
  constructor(
    public readonly id: string,
    public readonly youtubeVideoId: string,
    public readonly youtubeTitle: string,
    public readonly youtubeChannel: string | null,
    public readonly spotifyTrackId: string | null,
    public readonly spotifyUri: string | null,
    public readonly spotifyArtist: string | null,
    public readonly spotifyAlbum: string | null,
    public readonly matchScore: number,
    public readonly matchedAt: Date | null,
    public readonly matchSource: string | null,
    public readonly isOfficialVideo: boolean,
    public readonly isVisualizer: boolean,
    public readonly isLive: boolean,
    public readonly aiConfidence: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  hasSpotifyMatch(): boolean {
    return !!this.spotifyTrackId;
  }

  isGoodMatch(): boolean {
    return this.matchScore >= 0.8;
  }

  needsManualReview(): boolean {
    return this.matchScore < 0.6 && this.matchScore > 0;
  }
}