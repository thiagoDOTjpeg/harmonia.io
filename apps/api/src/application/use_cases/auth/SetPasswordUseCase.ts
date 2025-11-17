import { IHasher } from "@/application/ports/crypto/IHasher";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { User } from "@/domain/entities/User";
import { AppError, SetPasswordInput } from "@harmonia/shared";

export class SetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) { }

  async execute(user: User, data: SetPasswordInput) {
    if (user.passwordHash) throw new AppError("Caso tenha esquecido a senha, vá para o formulário de esqueci minha senha");
    const passwordHash = await this.hasher.hash(data.newPassword);
    await this.userRepository.update(user.id, { passwordHash });
  }
}