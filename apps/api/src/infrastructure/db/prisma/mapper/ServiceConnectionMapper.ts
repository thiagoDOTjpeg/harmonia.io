import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ServiceConnectionDTO, ServiceProvider } from "@harmonia/shared";
import { ServiceConnection as PrismaServiceConnection, ServiceProvider as PrismaServiceProvider } from "@prisma/client";

export class ServiceConnectionMapper {
  static toDTO(serviceConnection: ServiceConnection): ServiceConnectionDTO {
    return {
      id: serviceConnection.id,
      email: serviceConnection.email,
      expiresAt: serviceConnection.expiresAt?.toISOString(),
      metadata: JSON.stringify(serviceConnection.metadata),
      provider: serviceConnection.provider,
      providerAccountId: serviceConnection.providerAccountId,
      scopes: serviceConnection.scopes,
      userId: serviceConnection.userId,
      createdAt: serviceConnection.createdAt.toISOString()
    }
  }

  static toDomain(serviceConnection: PrismaServiceConnection): ServiceConnection {
    return new ServiceConnection(
      serviceConnection.id,
      serviceConnection.userId,
      ServiceProvider[serviceConnection.provider.toLocaleUpperCase() as keyof typeof ServiceProvider],
      serviceConnection.providerAccountId || "",
      serviceConnection.email,
      serviceConnection.accessToken,
      serviceConnection.refreshToken,
      serviceConnection.expiresAt,
      serviceConnection.scopes,
      serviceConnection.metadata,
      serviceConnection.updatedAt,
      serviceConnection.updatedAt,
    );
  }

  static toPrisma(serviceConnection: ServiceConnection): PrismaServiceConnection {
    return {
      id: serviceConnection.id,
      email: serviceConnection.email,
      accessToken: serviceConnection.accessToken,
      createdAt: serviceConnection.createdAt,
      expiresAt: serviceConnection.expiresAt,
      metadata: serviceConnection.metadata,
      provider: serviceConnection.provider as unknown as PrismaServiceProvider,
      providerAccountId: serviceConnection.providerAccountId,
      refreshToken: serviceConnection.refreshToken,
      scopes: serviceConnection.scopes,
      updatedAt: serviceConnection.updatedAt,
      userId: serviceConnection.userId,
      accessTokenIv: "",
      refreshTokenIv: ""
    }
  }
}