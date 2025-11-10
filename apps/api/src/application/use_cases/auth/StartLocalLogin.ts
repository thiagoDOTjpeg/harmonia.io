import { AuthResponse, LoginDto } from '@harmonia/shared';
import { IPasswordHasher } from '../../ports/crypto/IHasher';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export class StartLocalLogin {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: 'invalid_credentials',
        message: 'Email ou senha inválidos.',
      };
    }

    const isValid = await this.passwordHasher.verify(input.password, user.passwordHash);
    if (!isValid) {
      return {
        success: false,
        error: 'invalid_credentials',
        message: 'Email ou senha inválidos.',
      };
    }
    const token = this.tokenManager.sign({ sub: user.id });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}