import { IHasher } from "@/application/ports/crypto/IHasher";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { User } from "@/domain/entities/User";
import { ERRORS } from "@/types/constant/errors";
import { AppError, SetPasswordDTO } from "@harmonia/shared";

export class SetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) { }

  async execute(user: User, data: SetPasswordDTO) {
    if (user.hasPassword()) throw new AppError(ERRORS.SET_PASSWORD_USER_HAS_PASSWORD);
    const passwordHash = await this.hasher.hash(data.newPassword);
    user.changePassword(passwordHash)
    await this.userRepository.update(user);
  }
}