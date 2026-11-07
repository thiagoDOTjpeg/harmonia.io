export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  user: {
    all: ["user"] as const,
    summary: () => [...queryKeys.user.all, "summary"] as const,
    playlists: () => [...queryKeys.user.all, "playlists"] as const,
    connections: () => [...queryKeys.user.all, "connections"] as const,
  },
};
