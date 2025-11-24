import { ServiceConnectionDTO, UserPlaylistDTO, UserSummaryDTO } from "@harmonia/shared";
import { fetchApi } from "./api";


export const userService = {
  revokeConnection: async (serviceConnectionId: string, token: string): Promise<void> => {
    return fetchApi<void>(`/user/connection/${serviceConnectionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  },

  getPlaylists: async (token: string): Promise<UserPlaylistDTO[]> => {
    return fetchApi<UserPlaylistDTO[]>("/playlists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  },
  getSummary: async (token: string): Promise<UserSummaryDTO> => {
    return fetchApi<UserSummaryDTO>('/user/dashboard', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  },
  getServiceConnections: async (token: string): Promise<ServiceConnectionDTO[]> => {
    return fetchApi<ServiceConnectionDTO[]>("/user/connections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  }
}