import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { IOAuthCallbackFactory } from "@/application/ports/strategy/oauth/IOAuthCallbackFactory";
import { IOAuthCallbackStrategy } from "@/application/ports/strategy/oauth/IOAuthCallbackStrategy";
import { HandleOAuthCallbackUseCase } from "@/application/use_cases/auth/HandleOAuthCallbackUseCase";
import { UserBuilder } from "@/tests/builders/UserBuilder";
import { createMockStateStore } from "@/tests/factories/MockStateStoreFactory";
import { createMockOAuthStrategyFactory } from "@/tests/factories/MockStrategyFactory";
import { OAuthState } from "@/types/oauth/state";
import { AuthResponse, NotFoundError, OAuthMethod, ServiceProvider } from "@harmonia/shared";

describe("HandleOAuthCallbackUseCase", () => {
  let useCase: HandleOAuthCallbackUseCase;

  let mockStateStore: jest.Mocked<IStateStore<OAuthState>>;
  let mockStrategyFactory: jest.Mocked<IOAuthCallbackFactory>;
  let mockStrategy: jest.Mocked<IOAuthCallbackStrategy>;


  beforeEach(() => {
    jest.clearAllMocks();

    mockStateStore = createMockStateStore<OAuthState>();
    mockStrategyFactory = createMockOAuthStrategyFactory();
    mockStrategy = {
      processCallback: jest.fn(),
    }

    useCase = new HandleOAuthCallbackUseCase(mockStateStore, mockStrategyFactory);
  })

  it("should sucessfully get a strategy, process and return a auth response", async () => {
    const input = {
      provider: ServiceProvider.GOOGLE,
      code: "123456",
      state: "123456"
    }
    const user = new UserBuilder().build();
    const stateData: OAuthState = {
      method: OAuthMethod.connect,
      userId: user.id
    }
    const processResponse: AuthResponse = {
      isPasswordSetupRequired: false,
      token: "token-123",
      user,
      method: stateData.method,
      returnTo: stateData.returnTo
    }
    mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
    mockStateStore.get.mockResolvedValue(stateData);
    mockStrategy.processCallback.mockResolvedValue(processResponse);
    const result = await useCase.execute(input.provider, { code: input.code, state: input.state });

    expect(result).toEqual(processResponse);
    expect(mockStateStore.get).toHaveBeenCalledWith(input.state);
    expect(mockStateStore.delete).toHaveBeenCalledWith(input.state);
    expect(mockStrategyFactory.getStrategy).toHaveBeenCalledWith(input.provider);
    expect(mockStrategy.processCallback).toHaveBeenCalledWith(input.code, stateData, stateData.userId);
  })

  it("should throw an error if state is not found on store", async () => {
    const input = {
      provider: ServiceProvider.GOOGLE,
      code: "123456",
      state: "123456"
    }
    const error = new NotFoundError("State não encontrado")
    mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
    mockStateStore.get.mockResolvedValue(undefined);

    await expect(useCase.execute(input.provider, { code: input.code, state: input.state })).rejects.toThrow(error);

    expect(mockStateStore.get).toHaveBeenCalledWith(input.state);
    expect(mockStateStore.delete).not.toHaveBeenCalled();
    expect(mockStrategyFactory.getStrategy).not.toHaveBeenCalled();
    expect(mockStrategy.processCallback).not.toHaveBeenCalled();
  })

  it("should throw and error if the method in the state data retrivied from the store is equal connect and doesn't have a userId", async () => {
    const input = {
      provider: ServiceProvider.GOOGLE,
      code: "123456",
      state: "123456"
    }
    const error = new NotFoundError("Nenhum usuário conectado");
    const stateData: OAuthState = {
      method: OAuthMethod.connect,
    }
    mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
    mockStateStore.get.mockResolvedValue(stateData);

    await expect(useCase.execute(input.provider, { code: input.code, state: input.state })).rejects.toThrow(error)

    expect(mockStateStore.get).toHaveBeenCalled();
    expect(mockStateStore.delete).not.toHaveBeenCalled();
    expect(mockStrategyFactory.getStrategy).not.toHaveBeenCalled();
    expect(mockStrategy.processCallback).not.toHaveBeenCalled()
  })
})