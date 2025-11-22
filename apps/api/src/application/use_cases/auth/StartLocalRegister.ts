import { IHasher } from '@/application/ports/crypto/IHasher';
import { AppError, AuthResponse, RegisterDTO } from '@harmonia/shared';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export class StartLocalRegister {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: RegisterDTO): Promise<AuthResponse> {
    try {
      const normalizedEmail = input.email.trim().toLowerCase();

      const existing = await this.userRepository.findByEmail(normalizedEmail);
      if (existing) {
        throw new AppError("Email já utilizado")
      }

      const passwordHash = await this.passwordHasher.hash(input.password);

      const user = await this.userRepository.createFromLocal({
        email: normalizedEmail,
        name: input.name ?? null,
        passwordHash,
      });

      const token = this.tokenManager.sign({ sub: user.id });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new AppError("Email já utilizado")
      }
      throw error;
    }
  }
}