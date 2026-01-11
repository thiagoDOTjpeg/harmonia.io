import { IHasher } from "@/application/ports/crypto/IHasher";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { StartLocalRegisterUseCase } from "@/application/use_cases/auth/StartLocalRegisterUseCase";
import { ERRORS } from "@/types/constant/errors";
import { AppError } from "@harmonia/shared";
import { UserBuilder } from "../../builders/UserBuilder";
import { createMockHasher } from "../../factories/MockPasswordHasherFactory";
import { createMockTokenManager } from "../../factories/MockTokenManager";
import { createMockUserRepository } from "../../factories/MockUserRepositoryFactory";

describe("Start Local Register Use Case", () => {
  let useCase: StartLocalRegisterUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockPasswordHasher: jest.Mocked<IHasher>
  let mockTokenManager: jest.Mocked<ITokenManager>

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository();
    mockPasswordHasher = createMockHasher();
    mockTokenManager = createMockTokenManager();

    useCase = new StartLocalRegisterUseCase(mockUserRepository, mockPasswordHasher, mockTokenManager);
  })
  it("should successfully register a user and return token and user info", async () => {
    const passwordHash = "senha-hasheada"
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue(passwordHash);
    mockTokenManager.sign.mockReturnValue("tokencriptografado");

    mockUserRepository.save.mockImplementation(async (user) => user)

    const payload = { email: "test@example.com", password: "teste123", name: "Test User" };
    const result = await useCase.execute(payload);

    expect(result.token).toBe("tokencriptografado");
    expect(result.user.email).toBe(payload.email);
    expect(result.user.name).toBe(payload.name);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(payload.password);

    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: payload.email,
        name: payload.name,
      })
    );
  });

  it("should throw an error if the email already exists", async () => {
    const validUser = new UserBuilder().build();
    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    const error = new AppError(ERRORS.EMAIL_ALREADY_IN_USE)

    await expect(useCase.execute({
      email: validUser.email,
      password: "teste123",
      name: validUser.name
    }))
      .rejects.toThrow(error);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  });

  it("should throw AppError when DB throws constraint violation (P2002) even if findByEmail returns null", async () => {
    const validUser = new UserBuilder().build();
    const error = new AppError(ERRORS.EMAIL_ALREADY_IN_USE)

    mockUserRepository.findByEmail.mockResolvedValue(null);

    const prismaError = new Error("Unique constraint failed");
    (prismaError as any).code = 'P2002';

    mockUserRepository.save.mockRejectedValue(prismaError);

    await expect(useCase.execute({
      email: validUser.email,
      password: "teste123",
      name: validUser.name
    }))
      .rejects.toThrow(error);

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });
})