import { IHasher } from '@/application/ports/crypto/IHasher';
import { ITokenManager } from '@/application/ports/crypto/ITokenManager';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { AuthResponse, InvalidCredentialsError, LoginDTO } from '@harmonia/shared';

export class StartLocalLogin {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: LoginDTO): Promise<AuthResponse> {
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
      token,
      isPasswordSetupRequired: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}