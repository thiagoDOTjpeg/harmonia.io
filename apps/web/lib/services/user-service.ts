import {
  ServiceConnectionDTO,
  UserPlaylistDTO,
  UserSummaryDTO,
} from "@harmonia/shared";
import { fetchApi } from "./api";

export const userService = {
  revokeConnection: async (serviceConnectionId: string): Promise<void> => {
    return fetchApi<void>(`/user/connection/${serviceConnectionId}`, {
      method: "DELETE",
    });
  },

  getPlaylists: async (): Promise<UserPlaylistDTO[]> => {
    return fetchApi<UserPlaylistDTO[]>("/playlists", {
      method: "GET",
    });
  },

  getSummary: async (): Promise<UserSummaryDTO> => {
    return fetchApi<UserSummaryDTO>("/user/dashboard", {
      method: "GET",
    });
  },

  getServiceConnections: async (): Promise<ServiceConnectionDTO[]> => {
    return fetchApi<ServiceConnectionDTO[]>("/user/connections", {
      method: "GET",
    });
  },
};
