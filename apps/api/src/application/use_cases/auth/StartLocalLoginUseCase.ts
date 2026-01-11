import { IHasher } from '@/application/ports/crypto/IHasher';
import { ITokenManager } from '@/application/ports/crypto/ITokenManager';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { ERRORS } from '@/types/constant/errors';
import { AuthResponse, InvalidCredentialsError, LoginDTO } from '@harmonia/shared';

export class StartLocalLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IHasher,
    private readonly tokenManager: ITokenManager,
  ) { }

  async execute(input: LoginDTO): Promise<AuthResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.hasPassword()) {
      throw new InvalidCredentialsError(ERRORS.INVALID_CREDENTIALS)
    }

    const isValid = await user.verifyPassword(input.password, this.passwordHasher);
    if (!isValid) {
      throw new InvalidCredentialsError(ERRORS.INVALID_CREDENTIALS)
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