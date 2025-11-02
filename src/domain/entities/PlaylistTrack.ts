export class PlaylistTrack {
  constructor(
    public readonly id: string,
    public readonly playlistId: string,
    public readonly trackId: string,
    public readonly status: 'pending' | 'synced' | 'failed',
    public readonly addedAt: Date,
    public readonly position: number | null,
  ) { }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isSynced(): boolean {
    return this.status === 'synced';
  }

  hasFailed(): boolean {
    return this.status === 'failed';
  }
}