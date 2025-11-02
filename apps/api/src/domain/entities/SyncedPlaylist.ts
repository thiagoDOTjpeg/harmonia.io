export class SyncedPlaylist {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly youtubePlaylistId: string,
    public readonly youtubeUrl: string,
    public readonly youtubeTitle: string | null,
    public readonly spotifyPlaylistId: string,
    public readonly spotifyUrl: string,
    public readonly spotifyTitle: string | null,
    public readonly syncStatus: string,
    public readonly lastSyncedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  isPending(): boolean {
    return this.syncStatus === 'pending';
  }

  isSyncing(): boolean {
    return this.syncStatus === 'syncing';
  }

  isCompleted(): boolean {
    return this.syncStatus === 'completed';
  }

  isPartial(): boolean {
    return this.syncStatus === 'partial';
  }

  hasFailed(): boolean {
    return this.syncStatus === 'failed';
  }
}