import { IHasher } from "@/application/ports/crypto/IHasher"
import { ITokenManager } from "@/application/ports/crypto/ITokenManager"
import { IUserRepository } from "@/application/repositories/IUserRepository"
import { StartLocalLogin } from "@/application/use_cases/auth/StartLocalLogin"
import { UserBuilder } from "../../builders/UserBuilder"
import { createMockHasher } from "../../factories/MockPasswordHasherFactory"
import { createMockTokenManager } from "../../factories/MockTokenManager"
import { createMockUserRepository } from "../../factories/MockUserRepositoryFactory"


describe("Start Local Login User Case", () => {
  let useCase: StartLocalLogin;
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockPasswordHasher: jest.Mocked<IHasher>
  let mockTokenManager: jest.Mocked<ITokenManager>

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository()
    mockPasswordHasher = createMockHasher()
    mockTokenManager = createMockTokenManager()

    useCase = new StartLocalLogin(mockUserRepository, mockPasswordHasher, mockTokenManager);
  })

  it("should successfully login and return token and user info", async () => {
    const validUser = new UserBuilder().build();
    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockPasswordHasher.verify.mockResolvedValue(true);
    mockTokenManager.sign.mockReturnValue("tokenAssinado");

    const payload = { email: validUser.email, password: "teste123" };
    const result = await useCase.execute(payload);

    expect(result.token).toBe("tokenAssinado");
    expect(result.user).toMatchObject({ id: validUser.id, email: validUser.email, name: validUser.name });

    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(payload.password, validUser.passwordHash);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);
  })

  it("should throw an error for wrong/incorrect password", async () => {
    const validUser = new UserBuilder().build();

    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockPasswordHasher.verify.mockResolvedValue(false);

    const payload = { email: "teste123@123.com", password: "senhaErrada" };
    await expect(useCase.execute(payload)).rejects.toThrow("Email ou senha inválidos");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(mockPasswordHasher.verify).toHaveBeenCalledTimes(1);
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  })

  it("should throw and error if the user doesn't exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const payload = { email: "teste123@123.com", password: "senhaErrada" };
    await expect(useCase.execute(payload)).rejects.toThrow("Email ou senha inválidos");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  })

  it("should throw and error if the user exists but doesn't have a password", async () => {
    const validUser = new UserBuilder().withoutPassword().build();

    mockUserRepository.findByEmail.mockResolvedValue(validUser);

    const payload = { email: "teste123@123.com", password: "senhaErrada" };
    await expect(useCase.execute(payload)).rejects.toThrow("Email ou senha inválidos");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  })
})
