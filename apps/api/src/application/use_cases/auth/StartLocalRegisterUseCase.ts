import { IHasher } from '@/application/ports/crypto/IHasher';
import { User } from '@/domain/entities/User';
import { ERRORS } from '@/types/constant/errors';
import { AppError, AuthResponse, RegisterDTO } from '@harmonia/shared';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export class StartLocalRegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: RegisterDTO): Promise<AuthResponse> {
    try {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing) {
        throw new AppError(ERRORS.EMAIL_ALREADY_IN_USE)
      }

      const passwordHash = await this.passwordHasher.hash(input.password);

      const newUser = User.create({ email: input.email, name: input.name, passwordHash });

      await this.userRepository.save(newUser);

      const token = this.tokenManager.sign({ sub: newUser.id });

      return {
        token,
        isPasswordSetupRequired: false,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new AppError(ERRORS.EMAIL_ALREADY_IN_USE)
      }
      throw error;
    }
  }
}