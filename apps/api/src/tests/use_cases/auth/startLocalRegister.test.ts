import { IHasher } from "@/application/ports/crypto/IHasher";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { StartLocalRegister } from "@/application/use_cases/auth/StartLocalRegister";
import { UserBuilder } from "../../builders/UserBuilder";
import { createMockHasher } from "../../factories/MockPasswordHasherFactory";
import { createMockTokenManager } from "../../factories/MockTokenManager";
import { createMockUserRepository } from "../../factories/MockUserRepositoryFactory";

describe("Start Local Register Use Case", () => {
  let useCase: StartLocalRegister;
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockPasswordHasher: jest.Mocked<IHasher>
  let mockTokenManager: jest.Mocked<ITokenManager>

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository();
    mockPasswordHasher = createMockHasher();
    mockTokenManager = createMockTokenManager();

    useCase = new StartLocalRegister(mockUserRepository, mockPasswordHasher, mockTokenManager);
  })
  it("should successfully register a user and return token and user info", async () => {
    const validUser = new UserBuilder().build();
    mockUserRepository.createFromLocal.mockResolvedValue(validUser);
    mockPasswordHasher.hash.mockResolvedValue(validUser.passwordHash!);
    mockTokenManager.sign.mockReturnValue("tokencriptografado");

    const payload = { email: validUser.email, password: "teste123", name: validUser.name };
    const result = await useCase.execute(payload);

    expect(result.token).toBe("tokencriptografado");
    expect(result.user).toMatchObject({ id: validUser.id, email: validUser.email, name: validUser.name });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUser.email);
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(payload.password);
    expect(mockUserRepository.createFromLocal).toHaveBeenCalledWith({
      email: payload.email,
      name: payload.name,
      passwordHash: validUser.passwordHash,
    });
  });

  it("should throw an error if the email already exists", async () => {
    const validUser = new UserBuilder().build();
    mockUserRepository.findByEmail.mockResolvedValue(validUser);

    await expect(useCase.execute({
      email: validUser.email,
      password: "teste123",
      name: validUser.name
    }))
      .rejects.toThrow("Email já utilizado");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.createFromLocal).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  });

  it("should throw AppError when DB throws constraint violation (P2002) even if findByEmail returns null", async () => {
    const validUser = new UserBuilder().build();

    mockUserRepository.findByEmail.mockResolvedValue(null);

    const prismaError = new Error("Unique constraint failed");
    (prismaError as any).code = 'P2002';

    mockUserRepository.createFromLocal.mockRejectedValue(prismaError);

    await expect(useCase.execute({
      email: validUser.email,
      password: "teste123",
      name: validUser.name
    }))
      .rejects.toThrow("Email já utilizado");

    expect(mockUserRepository.createFromLocal).toHaveBeenCalledTimes(1);
  });
})