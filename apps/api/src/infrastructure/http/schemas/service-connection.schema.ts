import { ServiceProvider } from "@harmonia/shared";
import z from "zod/v4";

export const createServiceConnectionSchema = z.object({
  userId: z.string(),
  provider: z.enum(ServiceProvider),
  providerAccountId: z.string().optional().nullable(),
  email: z.email().optional().nullable(),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.date().optional().nullable(),
  scopes: z.string(),
  metadata: z.json().optional().nullable(),
})

export const updateServiceConnectionSchema = z.object({
  userId: z.string().optional().nullable(),
  provider: z.enum(ServiceProvider).optional().nullable(),
  providerAccountId: z.string().optional().nullable(),
  email: z.email().optional().nullable(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.date().optional().nullable(),
  scopes: z.string().optional().nullable(),
  metadata: z.json().optional().nullable(),
})


export type createServiceConnectionDto = z.infer<typeof createServiceConnectionSchema>;
export type updateServiceConnectionDto = z.infer<typeof updateServiceConnectionSchema>;