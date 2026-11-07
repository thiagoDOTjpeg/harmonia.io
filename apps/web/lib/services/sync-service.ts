import { SyncPlaylistResponse } from "@harmonia/shared";
import { fetchApi } from "./api";

export const syncService = {
  postSyncPlaylists: async (data: {
    youtubePlaylistId: string;
  }): Promise<SyncPlaylistResponse> => {
    return fetchApi<SyncPlaylistResponse>("/sync/playlist", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
