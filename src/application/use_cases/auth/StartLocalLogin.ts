import { AuthResponse } from '../../../legacy/types';
import { IPasswordHasher } from '../../ports/crypto/IPasswordHasher';
import { ITokenManager } from '../../ports/crypto/ITokenManager';
import { IUserRepository } from '../../repositories/IUserRepository';

export interface LoginInput {
  email: string;
  password: string;
}

export class StartLocalLogin {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: LoginInput): Promise<AuthResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Busca usuário
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
      return {
        error: 'invalid_credentials',
        message: 'Email ou senha inválidos.',
      };
    }

    // Verifica senha
    const isValid = await this.passwordHasher.verify(input.password, user.passwordHash);
    if (!isValid) {
      return {
        error: 'invalid_credentials',
        message: 'Email ou senha inválidos.',
      };
    }

    // Gera token JWT
    const token = this.tokenManager.sign({ sub: user.id });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        googleId: user.googleId,
        spotifyId: user.spotifyId,
      },
    };
  }
}