import { useSyncPlaylistMutation } from "@/hooks/mutations/use-sync-playlist";

export function usePlaylist() {
  const syncPlaylistMutation = useSyncPlaylistMutation();

  const postSyncPlaylist = async (data: { youtubePlaylistId: string }) => {
    try {
      return await syncPlaylistMutation.mutateAsync(data);
    } catch {
      return null;
    }
  };

  return {
    isLoading: syncPlaylistMutation.isPending,
    postSyncPlaylist,
  };
}
