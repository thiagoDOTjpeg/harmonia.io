export class RecentSync {
  constructor(
    public id: string,
    public name: string,
    public source_platform: string,
    public target_platform: string,
    public songs_count: number,
    public last_synced_at: string,
    public status: string,
  ) { }
}