import { z } from "zod/v4";

export const createSyncPlaylistSchema = z.object({
  youtubePlaylistId: z.string().min(1, "Youtube playlist ID é obrigatório"),
  priority: z.number().min(1).max(100).optional()
})

export const getSyncPlaylistStatusSchema = z.object({
  jobId: z.string().min(1, "Job ID é obrigatório")
})

export const cancelSyncPlaylistSchema = z.object({
  jobId: z.string().min(1, "Job ID é obrigatório")
})

export const retrySyncPlaylistSchema = z.object({
  jobId: z.string().min(1, "Job ID é obrigatório")
})

export type getSyncPlaylistStatusDto = z.infer<typeof getSyncPlaylistStatusSchema>
export type cancelSyncPlaylistDto = z.infer<typeof cancelSyncPlaylistSchema>
export type retrySyncPlaylistDto = z.infer<typeof retrySyncPlaylistSchema>
export type createSyncPlaylistDto = z.infer<typeof createSyncPlaylistSchema>;