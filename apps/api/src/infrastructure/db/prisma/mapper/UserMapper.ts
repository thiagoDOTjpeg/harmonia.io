import { User } from '@/domain/entities/User';
import { User as PrismaUser } from '@prisma/client';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {

    return User.reconstitute({
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name ?? "",
      passwordHash: prismaUser.passwordHash,
      emailVerifiedAt: prismaUser.emailVerifiedAt
    });
  }

  static toPrisma(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user['_passwordHash'], 
      emailVerifiedAt: user['_emailVerifiedAt'],
    };
  }
}