import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../application/ports/crypto/IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly rounds = 10;

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.rounds);
  }

  async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}