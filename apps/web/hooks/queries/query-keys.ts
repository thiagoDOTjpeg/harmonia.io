export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  user: {
    all: ["user"] as const,
    summary: () => [...queryKeys.user.all, "summary"] as const,
    playlists: () => [...queryKeys.user.all, "playlists"] as const,
    playlistDetails: (playlistId: string) =>
      [...queryKeys.user.all, "playlists", playlistId] as const,
    trackCandidates: (playlistId: string, trackId: string, query?: string) =>
      [
        ...queryKeys.user.all,
        "playlists",
        playlistId,
        "tracks",
        trackId,
        "candidates",
        query || "",
      ] as const,
    connections: () => [...queryKeys.user.all, "connections"] as const,
  },
};
