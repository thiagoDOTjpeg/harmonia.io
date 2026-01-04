import { IEmailProvider } from "@/application/ports/email/IEmailProvider";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IUserRepository } from "@/application/repositories/IUserRepository";
import { RequestPasswordResetUseCase } from "@/application/use_cases/auth/RequestPasswordResetUseCase";
import { User } from "@/domain/entities/User";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockEmailProvider } from "@/tests/factories/MockEmailProviderFactory";
import { createMockStateStore } from "@/tests/factories/MockStateStoreFactory";
import { createMockUserRepository } from "@/tests/factories/MockUserRepositoryFactory";
import { ResetState } from "@/types/auth";
import { RequestResetPasswordDTO } from "@harmonia/shared";

describe("RequestPasswordResetUseCase", () => {
  let useCase: RequestPasswordResetUseCase;

  let spyOnMathRandom: jest.SpyInstance;
  let spyOnMathFloor: jest.SpyInstance;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockStateStore: jest.Mocked<IStateStore<ResetState>>;
  let mockEmailProvider: jest.Mocked<IEmailProvider>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = createMockUserRepository();
    mockStateStore = createMockStateStore<ResetState>()
    mockEmailProvider = createMockEmailProvider();
    spyOnMathRandom = jest.spyOn(global.Math, "random");
    spyOnMathFloor = jest.spyOn(global.Math, "floor");

    useCase = new RequestPasswordResetUseCase(mockUserRepository, mockStateStore, mockEmailProvider);
  })

  afterEach(() => {
    spyOnMathFloor.mockRestore();
    spyOnMathRandom.mockRestore();
  })

  it("should successfully send email to the user and set the random code in the state", async () => {
    const randomCode = 123456 + 100000
    const foundUser: User = new UserBuilder().build();
    const dto: RequestResetPasswordDTO = {
      email: "test@gmail.com"
    }

    spyOnMathFloor.mockReturnValue(123456)
    spyOnMathRandom.mockReturnValue(123456)
    mockUserRepository.findByEmail.mockResolvedValue(foundUser);


    await useCase.execute(dto);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockStateStore.set).toHaveBeenCalledWith(foundUser.id, { randomCode }, 600)
    expect(mockEmailProvider.sendResetPasswordEmail).toHaveBeenCalledWith(foundUser.email, randomCode);
  })

  it("should return null if user's isn't found", async () => {
    const dto: RequestResetPasswordDTO = {
      email: "test@gmail.com"
    }
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result).toBe(null);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockStateStore.set).not.toHaveBeenCalled();
    expect(mockEmailProvider.sendResetPasswordEmail).not.toHaveBeenCalled();
  })
})