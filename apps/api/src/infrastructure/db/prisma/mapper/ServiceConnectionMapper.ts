import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { updateServiceConnectionDto } from "@/infrastructure/http/schemas/service-connection.schema";
import { ServiceProvider } from "@harmonia/shared";
import { Prisma, ServiceConnection as PrismaServiceConnection, ServiceProvider as PrismaServiceProvider } from "@prisma/client";

export class ServiceConnectionMapper {
  static toDomain(serviceConnection: PrismaServiceConnection): ServiceConnection {
    return new ServiceConnection(
      serviceConnection.id,
      serviceConnection.userId,
      ServiceProvider[serviceConnection.provider as keyof typeof ServiceProvider],
      serviceConnection.providerAccountId,
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
      userId: serviceConnection.userId
    }
  }

  static updateToPrisma(dto: updateServiceConnectionDto): Prisma.ServiceConnectionUncheckedUpdateInput {
    const data: Prisma.ServiceConnectionUncheckedUpdateInput = {
      updatedAt: new Date(),
    };

    if (dto.accessToken) {
      data.accessToken = dto.accessToken;
    }

    if (dto.scopes) {
      data.scopes = dto.scopes;
    }

    if (dto.provider) {
      data.provider = dto.provider as unknown as PrismaServiceProvider;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.refreshToken !== undefined) {
      data.refreshToken = dto.refreshToken;
    }

    if (dto.providerAccountId !== undefined) {
      data.providerAccountId = dto.providerAccountId;
    }

    if (dto.expiresAt !== undefined) {
      data.expiresAt = dto.expiresAt;
    }

    if (dto.metadata !== undefined) {
      data.metadata = dto.metadata === null ? Prisma.DbNull : dto.metadata;
    }

    return data;
  }
}