import { IHasher } from '@/application/ports/crypto/IHasher';
import bcrypt from 'bcryptjs';

export class BcryptPasswordHasher implements IHasher {
  private readonly rounds = 10;

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.rounds);
  }

  async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}