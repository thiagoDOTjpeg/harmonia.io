import { ServiceProvider } from "../enum/service-connection";

export interface ServiceConnection {
  id: string,
  userId: string,
  provider: ServiceProvider,
  providerAccountId: string,
  email: string | null,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: string | null,
  scopes: string,
  metadata: string | null,
  createdAt: string,
  updatedAt: string,
}