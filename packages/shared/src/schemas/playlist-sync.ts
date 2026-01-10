import { z } from "zod";

export const createSyncPlaylistSchema = z.object({
  youtubePlaylistId: z.string().min(1, "Youtube playlist ID é obrigatório"),
  priority: z.number().min(1).max(100).optional()
})

export const baseSyncPlaylistSchema = z.object({
  jobId: z.string().min(1, "Job ID é obrigatório")
})

export type getSyncPlaylistStatusDTO = z.infer<typeof baseSyncPlaylistSchema>
export type cancelSyncPlaylistDTO = z.infer<typeof baseSyncPlaylistSchema>
export type retrySyncPlaylistDTO = z.infer<typeof baseSyncPlaylistSchema>
export type createSyncPlaylistDTO = z.infer<typeof createSyncPlaylistSchema>;