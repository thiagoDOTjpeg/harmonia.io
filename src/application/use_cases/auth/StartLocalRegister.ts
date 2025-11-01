import { AuthResponse } from '../../../shared/types/oauth/oauth';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export class StartLocalRegister {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: RegisterInput): Promise<AuthResponse> {
    try {
      const normalizedEmail = input.email.trim().toLowerCase();

      const existing = await this.userRepository.findByEmail(normalizedEmail);
      if (existing) {
        return {
          error: 'email_in_use',
          message: 'Já existe uma conta com este email.',
        };
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
        return {
          error: 'email_in_use',
          message: 'Já existe uma conta com este email.',
        };
      }
      throw error;
    }
  }
}