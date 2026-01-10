import { IHasher } from "@/application/ports/crypto/IHasher";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { ResetPasswordUseCase } from "@/application/use_cases/auth/ResetPasswordUseCase";
import { User } from "@/domain/entities/User";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockHasher } from "@/tests/factories/MockPasswordHasherFactory";
import { createMockStateStore } from "@/tests/factories/MockStateStoreFactory";
import { createMockUserRepository } from "@/tests/factories/MockUserRepositoryFactory";
import { ResetState } from "@/types/auth";
import { ERRORS } from "@/types/constant/errors";
import { AppError, ResetPasswordDTO } from "@harmonia/shared";

describe("ResetPasswordUseCase", () => {
  let useCase: ResetPasswordUseCase;

  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockStateStore: jest.Mocked<IStateStore<ResetState>>
  let mockHasher: jest.Mocked<IHasher>

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository();
    mockStateStore = createMockStateStore<ResetState>();
    mockHasher = createMockHasher();

    useCase = new ResetPasswordUseCase(mockUserRepository, mockStateStore, mockHasher);
  })

  it("should sucessfully change the users password", async () => {
    const foundUser: User = new UserBuilder().build();
    const foundState: ResetState = {
      randomCode: "123456"
    }
    const input: ResetPasswordDTO = {
      code: "123456",
      email: "test@gmail.com",
      newPassword: "newPassword-123"
    }

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    mockStateStore.get.mockResolvedValue(foundState);
    mockHasher.hash.mockResolvedValue("hashed-password")

    await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockStateStore.get).toHaveBeenCalledWith(foundUser.id);
    expect(mockHasher.hash).toHaveBeenCalledWith(input.newPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith({ ...foundUser, _passwordHash: "hashed-password" });
    expect(mockStateStore.delete).toHaveBeenCalledWith(foundUser.id);
  })

  it("should throw an error if doesn't find the user", async () => {
    const input: ResetPasswordDTO = {
      code: "123456",
      email: "test@gmail.com",
      newPassword: "newPassword-123"
    }
    const error = new AppError(ERRORS.RESET_PASSWORD);
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(error)

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockStateStore.get).not.toHaveBeenCalled();
    expect(mockHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockStateStore.delete).not.toHaveBeenCalled();
  })

  it("should throw an error if the state store doesn't find the state code", async () => {
    const foundUser = new UserBuilder().build();
    const input: ResetPasswordDTO = {
      code: "123456",
      email: "test@gmail.com",
      newPassword: "newPassword-123"
    }
    const error = new AppError(ERRORS.RESET_PASSWORD);
    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    mockStateStore.get.mockResolvedValue(undefined);

    await expect(useCase.execute(input)).rejects.toThrow(error)

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockStateStore.get).toHaveBeenCalledWith(foundUser.id);
    expect(mockHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockStateStore.delete).not.toHaveBeenCalled();
  })

  it("should throw an error if the code sent on the dto is different from the retrivied state", async () => {
    const foundUser = new UserBuilder().build();
    const foundState: ResetState = {
      randomCode: "654312"
    }
    const input: ResetPasswordDTO = {
      code: "123456",
      email: "test@gmail.com",
      newPassword: "newPassword-123"
    }
    const error = new AppError(ERRORS.RESET_PASSWORD);
    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    mockStateStore.get.mockResolvedValue(foundState)

    await expect(useCase.execute(input)).rejects.toThrow(error)

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockStateStore.get).toHaveBeenCalledWith(foundUser.id);
    expect(mockHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockStateStore.delete).not.toHaveBeenCalled();

  })
})