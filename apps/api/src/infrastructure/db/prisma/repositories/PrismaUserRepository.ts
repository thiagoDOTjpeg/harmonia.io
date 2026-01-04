import { UserSummary } from '@/domain/entities/UserSummary';
import { Prisma, PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../../application/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserMapper } from '../mapper/UserMapper';
import { UserSummaryMapper } from '../mapper/UserSummaryMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async getUserSummary(userId: string): Promise<UserSummary | null> {
    const summary = await this.prisma.userSummary.findFirst({ where: { userId } });
    return summary ? UserSummaryMapper.toDomain(summary) : null;
  }

  async createFromLocal(input: {
    email: string;
    name: string;
    passwordHash?: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        name: input.name,
        passwordHash: input.passwordHash ?? Prisma.skip,
      },
    });
    return UserMapper.toDomain(user);
  }

  async update(userId: string, userData: Prisma.UserUpdateInput): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userData
    });

    return UserMapper.toDomain(updatedUser);
  }

}