import { ServiceProvider } from "@harmonia/shared";
import { JsonValue } from "@prisma/client/runtime/client";

export class ServiceConnection {
  constructor(
    public id: string,
    public userId: string,
    public provider: ServiceProvider,
    public providerAccountId: string | null,
    public email: string | null,
    public accessToken: string,
    public refreshToken: string | null,
    public expiresAt: Date | null,
    public scopes: string,
    public metadata: JsonValue | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }
}