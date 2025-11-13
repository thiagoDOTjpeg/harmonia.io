import { SyncPlaylistResponse } from "@harmonia/shared";
import { fetchApi } from "./api";

export const syncService = {
  postSyncPlaylists: async (token: string, data: { youtubePlaylistId: string }): Promise<SyncPlaylistResponse> => {
    return fetchApi<SyncPlaylistResponse>("/sync/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
  }
}