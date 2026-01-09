import { ICodeGenerator } from "@/application/ports/crypto/ICodeGenerator";
import { IEmailProvider } from "@/application/ports/email/IEmailProvider";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ResetState } from "@/types/auth";
import { RequestResetPasswordDTO } from "@harmonia/shared";

export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redisStore: IStateStore<ResetState>,
    private readonly emailProvider: IEmailProvider,
    private readonly codeGenerator: ICodeGenerator
  ) { }

  async execute(data: RequestResetPasswordDTO) {
    const user = await this.userRepository.findByEmail(data.email);

    const randomCode = this.codeGenerator.generateResetPasswordCode();

    if (user) {
      await this.redisStore.set(user.id, { randomCode }, 600);
      await this.emailProvider.sendResetPasswordEmail(user.email, randomCode);
    } else {
      await this.simulateProcessingTime();
    }
  }

  private async simulateProcessingTime(): Promise<void> {
    const delay = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}