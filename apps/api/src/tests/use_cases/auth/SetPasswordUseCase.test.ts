import { IHasher } from "@/application/ports/crypto/IHasher";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { SetPasswordUseCase } from "@/application/use_cases/auth/SetPasswordUseCase";
import { AppError } from "@harmonia/shared";
import { UserBuilder } from "../../builders/UserBuilder";
import { createMockHasher } from "../../factories/MockPasswordHasherFactory";
import { createMockUserRepository } from "../../factories/MockUserRepositoryFactory";

describe("SetPasswordUseCase", () => {
  let useCase: SetPasswordUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockPasswordHasher: jest.Mocked<IHasher>

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository()
    mockPasswordHasher = createMockHasher()

    useCase = new SetPasswordUseCase(mockUserRepository, mockPasswordHasher);
  })

  it("should persist new password on the database", async () => {
    const passwordHash = "senha-haseheada"
    const newPassword = "senha-nova"
    mockPasswordHasher.hash.mockResolvedValue(passwordHash);
    const mockUser = new UserBuilder().withoutPassword().build();

    await useCase.execute(mockUser, { newPassword });

    expect(mockPasswordHasher.hash).toHaveBeenCalled()
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { passwordHash });
  })

  it("should throw error when user already has a password", async () => {
    const newPassword = "senha-nova"
    const error = new AppError("Caso tenha esquecido a senha, vá para o formulário de esqueci minha senha")
    const mockUser = new UserBuilder().withPasswordHash("senha-haseheada").build();

    await expect(useCase.execute(mockUser, { newPassword })).rejects.toThrow(error)

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  })
})