import { IHasher } from '@/application/ports/crypto/IHasher';
import { LoginDto } from '@/infrastructure/http/schemas/auth';
import { AuthResponse, InvalidCredentialsError } from '@harmonia/shared';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export class StartLocalLogin {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      throw new InvalidCredentialsError("Email ou senha inválidos.s")
    }

    const isValid = await this.passwordHasher.verify(input.password, user.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsError("Email ou senha inválidos.s")
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