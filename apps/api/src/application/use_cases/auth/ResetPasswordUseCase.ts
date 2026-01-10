import { IHasher } from "@/application/ports/crypto/IHasher";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ResetState } from "@/types/auth";
import { ERRORS } from "@/types/constant/errors";
import { AppError, ResetPasswordDTO } from "@harmonia/shared";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redisStore: IStateStore<ResetState>,
    private readonly hasher: IHasher
  ) { }

  async execute(data: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new AppError(ERRORS.RESET_PASSWORD);

    const state = await this.redisStore.get(user.id)
    if (!state) throw new AppError(ERRORS.RESET_PASSWORD);

    if (data.code !== state?.randomCode) throw new AppError(ERRORS.RESET_PASSWORD);

    const hashedPassword = await this.hasher.hash(data.newPassword);
    user.changePassword(hashedPassword);

    await this.userRepository.update(user);

    await this.redisStore.delete(user.id)
  }
}