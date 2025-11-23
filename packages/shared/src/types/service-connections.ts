import { ServiceProvider } from "../enum/service-connection";

export interface ServiceConnectionDTO {
  id: string,
  userId: string,
  provider: ServiceProvider,
  providerAccountId: string,
  email?: string | null,
  expiresAt?: string | null,
  scopes: string,
  metadata?: string | null,
  createdAt: Date
}