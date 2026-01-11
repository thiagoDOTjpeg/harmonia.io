import { User } from '@/domain/entities/User';
import { UserSummary } from '@/domain/entities/UserSummary';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;
  getUserSummary(userId: string): Promise<UserSummary | null>

  save(user: User): Promise<User>;

  update(user: User): Promise<User>;
}