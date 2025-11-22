import { IEmailProvider } from "@/application/ports/email/IEmailProvider";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ResetState } from "@/types/auth";
import { RequestResetPasswordDTO } from "@harmonia/shared";

export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redisStore: IStateStore<ResetState>,
    private readonly emailProvider: IEmailProvider
  ) { }

  async execute(data: RequestResetPasswordDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) return null;
    const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    await this.redisStore.set(user?.id, { randomCode }, 600);
    await this.emailProvider.sendResetPasswordEmail(user.email, randomCode);
  }
}