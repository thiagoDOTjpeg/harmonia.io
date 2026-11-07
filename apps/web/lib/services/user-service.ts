import {
  MatchTrackRequestDTO,
  MatchTrackResponseDTO,
  PlaylistDetailsDTO,
  ServiceConnectionDTO,
  TrackCandidatesResponseDTO,
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

  getPlaylistDetails: async (playlistId: string): Promise<PlaylistDetailsDTO> => {
    return fetchApi<PlaylistDetailsDTO>(`/playlists/${playlistId}`, {
      method: "GET",
    });
  },

  deletePlaylist: async (playlistId: string): Promise<void> => {
    return fetchApi<void>(`/playlists/${playlistId}`, {
      method: "DELETE",
    });
  },

  getTrackCandidates: async (
    playlistId: string,
    trackId: string,
    query?: string
  ): Promise<TrackCandidatesResponseDTO> => {
    const searchParams = query?.trim()
      ? `?${new URLSearchParams({ q: query.trim() }).toString()}`
      : "";
    return fetchApi<TrackCandidatesResponseDTO>(
      `/playlists/${playlistId}/tracks/${trackId}/candidates${searchParams}`,
      {
        method: "GET",
      }
    );
  },

  matchTrack: async (
    playlistId: string,
    trackId: string,
    data: MatchTrackRequestDTO
  ): Promise<MatchTrackResponseDTO> => {
    return fetchApi<MatchTrackResponseDTO>(
      `/playlists/${playlistId}/tracks/${trackId}/match`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
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
