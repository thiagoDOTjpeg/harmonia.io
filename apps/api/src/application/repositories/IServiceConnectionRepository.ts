import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ServiceProvider } from "@harmonia/shared";
import { Prisma } from "@prisma/client";

export interface IServiceConnectionRepository {
  findByEmail(email: string): Promise<ServiceConnection | null>
  findByEmailAndServiceProvider(email: string, serviceProvider: ServiceProvider): Promise<ServiceConnection | null>
  findByService(serviceProvider: ServiceProvider): Promise<ServiceConnection | null>
  findByServiceId(providerAccountId: string): Promise<ServiceConnection | null>
  findAllByUserId(userId: string): Promise<ServiceConnection[] | null>
  createServiceConnection(data: Prisma.ServiceConnectionUncheckedCreateInput): Promise<ServiceConnection>
  updateServiceConnection(data: Prisma.ServiceConnectionUncheckedUpdateInput, serviceConnectionId: string): Promise<ServiceConnection>
}