import { IHasher } from "@/application/ports/crypto/IHasher";
import { ITokenManager } from "@/application/ports/crypto/ITokenManager";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { StartLocalRegister } from "@/application/use_cases/auth/StartLocalRegister";
import { User } from "@/domain/entities/User";

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

describe("Start Local Register Use Case", () => {
  let useCase: StartLocalRegister;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.createFromLocal.mockResolvedValue(MOCK_USER);

    mockPasswordHasher.hash.mockResolvedValue("senhaHasheada");
    mockTokenManager.sign.mockReturnValue("tokencriptografado");

    useCase = new StartLocalRegister(mockUserRepository, mockPasswordHasher, mockTokenManager);
  })
  it("should successfully register a user and return token and user info", async () => {
    const payload = { email: MOCK_USER.email, password: "teste123", name: MOCK_USER.name! };
    const result = await useCase.execute(payload);

    expect(result.token).toBe("tokencriptografado");
    expect(result.user).toMatchObject({ id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(MOCK_USER.email);
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(payload.password);
    expect(mockUserRepository.createFromLocal).toHaveBeenCalledWith({
      email: payload.email,
      name: payload.name,
      passwordHash: MOCK_USER.passwordHash,
    });
  });

  it("should throw an error if the email already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(MOCK_USER);

    await expect(useCase.execute({
      email: MOCK_USER.email,
      password: "teste123",
      name: MOCK_USER.name
    }))
      .rejects.toThrow("Email já utilizado");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.createFromLocal).not.toHaveBeenCalled();
    expect(mockTokenManager.sign).not.toHaveBeenCalled();
  });
})