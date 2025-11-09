import { IServiceConnectionRepository } from "@/application/repositories/IServiceConnectionRepository";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ServiceProvider } from "@harmonia/shared";
import { Prisma, PrismaClient, ServiceProvider as PrismaServiceProvider } from "@prisma/client";
import { ServiceConnectionMapper } from "../mapper/ServiceConnectionMapper";

export class PrismaServiceConnectionRepository implements IServiceConnectionRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findAllByUserId(userId: string): Promise<ServiceConnection[] | null> {
    const serviceConnections = await this.prisma.serviceConnection.findMany({
      where: {
        userId: userId
      }
    })
    if (serviceConnections.length == 0) {
      return null;
    }
    const mappedServiceConnections = serviceConnections.map((sc) => {
      return ServiceConnectionMapper.toDomain(sc);
    })
    return mappedServiceConnections;
  }

  async findByEmail(email: string): Promise<ServiceConnection | null> {
    const serviceConnection = await this.prisma.serviceConnection.findFirst({
      where: {
        email: email
      }
    })
    return serviceConnection ? ServiceConnectionMapper.toDomain(serviceConnection) : null;
  }

  async findByEmailAndServiceProvider(email: string, serviceProvider: ServiceProvider): Promise<ServiceConnection | null> {
    const serviceConnection = await this.prisma.serviceConnection.findFirst({
      where: {
        email: email,
        provider: serviceProvider as unknown as PrismaServiceProvider
      }
    })
    return serviceConnection ? ServiceConnectionMapper.toDomain(serviceConnection) : null;
  }


  async findByService(serviceProvider: ServiceProvider): Promise<ServiceConnection | null> {
    const serviceConnection = await this.prisma.serviceConnection.findFirst({
      where: {
        provider: serviceProvider as unknown as PrismaServiceProvider
      }
    });
    return serviceConnection ? ServiceConnectionMapper.toDomain(serviceConnection) : null;
  }

  async findByServiceId(providerAccountId: string): Promise<ServiceConnection | null> {
    const serviceConnection = await this.prisma.serviceConnection.findFirst({
      where: {
        providerAccountId: providerAccountId
      }
    });
    return serviceConnection ? ServiceConnectionMapper.toDomain(serviceConnection) : null;
  }

  async createServiceConnection(data: Prisma.ServiceConnectionUncheckedCreateInput): Promise<ServiceConnection> {
    const serviceConnection = await this.prisma.serviceConnection.create({ data })
    return ServiceConnectionMapper.toDomain(serviceConnection);
  }

  async updateServiceConnection(data: Prisma.ServiceConnectionUncheckedUpdateInput, serviceConnectionId: string): Promise<ServiceConnection> {
    const serviceConnection = await this.prisma.serviceConnection.update({ where: { providerAccountId: serviceConnectionId }, data });
    return ServiceConnectionMapper.toDomain(serviceConnection);
  }

}