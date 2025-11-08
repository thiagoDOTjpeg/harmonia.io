import { UserSummary } from '@/domain/entities/UserSummary';
import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;
  getUserSummary(userId: string): Promise<UserSummary | null>

  createFromLocal(input: {
    email: string;
    name: string | null;
    passwordHash?: string;
  }): Promise<User>;
}