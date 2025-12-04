import { IHasher } from "@/application/ports/crypto/IHasher"
import { ITokenManager } from "@/application/ports/crypto/ITokenManager"
import { IUserRepository } from "@/application/repositories/IUserRepository"
import { StartLocalLogin } from "@/application/use_cases/auth/StartLocalLogin"
import { User } from "@/domain/entities/User"

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createFromLocal: jest.fn(),
  findByEmail: jest.fn(),
  findByUserId: jest.fn(),
  getUserSummary: jest.fn(),
  update: jest.fn()
}
const mockPasswordHasher: jest.Mocked<IHasher> = {
  hash: jest.fn(),
  verify: jest.fn()
}
const mockTokenManager: jest.Mocked<ITokenManager> = {
  decode: jest.fn(),
  sign: jest.fn()
}

const MOCK_USER: User = {
  id: "1",
  email: "teste123@teste.com",
  name: "thiago",
  passwordHash: "senhaHasheada",
  emailVerifiedAt: new Date()
};

describe("Start Local Login User Case", () => {
  let useCase: StartLocalLogin;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository.findByEmail.mockResolvedValue(MOCK_USER);

    mockPasswordHasher.verify.mockResolvedValue(true);
    mockTokenManager.sign.mockReturnValue("tokencriptografado");

    useCase = new StartLocalLogin(mockUserRepository, mockPasswordHasher, mockTokenManager);
  })

  it("should successfully login and return token and user info", async () => {
    const payload = { email: MOCK_USER.email, password: "teste123" };
    const result = await useCase.execute(payload);

    expect(result.token).toBe("tokencriptografado");
    expect(result.user).toMatchObject({ id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name });

    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(payload.password, MOCK_USER.passwordHash);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);
  })

  it("should throw an error for wrong/incorrect password", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(MOCK_USER);
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
    mockUserRepository.findByEmail.mockResolvedValue({ ...MOCK_USER, passwordHash: null });

    const payload = { email: "teste123@123.com", password: "senhaErrada" };
    await expect(useCase.execute(payload)).rejects.toThrow("Email ou senha inválidos");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  })
})
