import { ServiceConnection, UserPlaylist, UserSummary } from "@harmonia/shared";
import { fetchApi } from "./api";


export const userService = {
  getPlaylists: async (token: string): Promise<UserPlaylist[]> => {
    return fetchApi<UserPlaylist[]>("/playlists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  },
  getSummary: async (token: string): Promise<UserSummary> => {
    return fetchApi<UserSummary>('/user/dashboard', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  },
  getServiceConnections: async (token: string): Promise<ServiceConnection[]> => {
    return fetchApi<ServiceConnection[]>("/user/connections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  }
}