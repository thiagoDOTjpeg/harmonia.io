import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUrlProviderFactory";
import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";
import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { StartOAuthUseCase } from "@/application/use_cases/auth/StartOAuthUseCase";
import { OAuthState } from "@/types/oauth/state";
import { BadRequestError, OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { createMockAuthUrlFactory, createMockAuthUrlProvider } from "../factories/MockAuthUrlProviderFactory";
import { createMockOAuthStateStore } from "../factories/MockStateStoreFactory";

jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from("mocked-entropy-for-test-32b")),
}));

describe("Start OAuth Use Case", () => {
  let useCase: StartOAuthUseCase;
  let mockOAuthStateStore: jest.Mocked<IStateStore<OAuthState>>;
  let MockAuthUrlProviderFactory: jest.Mocked<IAuthUrlProviderFactory>;
  let mockAuthUrlProvider: jest.Mocked<IAuthUrlProvider>;


  beforeEach(() => {
    jest.clearAllMocks();

    mockOAuthStateStore = createMockOAuthStateStore();
    MockAuthUrlProviderFactory = createMockAuthUrlFactory();
    mockAuthUrlProvider = createMockAuthUrlProvider();

    useCase = new StartOAuthUseCase(mockOAuthStateStore, MockAuthUrlProviderFactory);
  })

  it("should generate the state, persist in the store and return the url for redirect", async () => {
    const redirectToValue = "http://redirectTo.com.br"
    MockAuthUrlProviderFactory.getStrategy.mockReturnValue(mockAuthUrlProvider)
    mockAuthUrlProvider.buildAuthUrl.mockReturnValue(redirectToValue)

    const expectedState = Buffer.from("mocked-entropy-for-test-32b").toString("base64url");

    const mockInput = {
      provider: ServiceProvider.GOOGLE,
      method: OAuthMethod.login,
      returnTo: "http://returnto.com.br",
      userId: "userid-123,"
    }

    const { redirectTo } = await useCase.execute(mockInput.method, mockInput.provider, mockInput.returnTo, mockInput.userId);

    expect(MockAuthUrlProviderFactory.getStrategy).toHaveBeenCalledWith(mockInput.provider);
    expect(mockOAuthStateStore.set).toHaveBeenCalledWith(
      expectedState,
      { method: mockInput.method, returnTo: mockInput.returnTo, userId: mockInput.userId },
      600
    );

    expect(mockAuthUrlProvider.buildAuthUrl).toHaveBeenCalledWith(expectedState);

    expect(redirectTo).toEqual(redirectToValue);
  })

  it("should propagate error when strategy is not found", async () => {
    const error = new BadRequestError("Serviço não suportado");

    MockAuthUrlProviderFactory.getStrategy.mockImplementation(() => {
      throw error
    });

    await expect(useCase.execute(
      OAuthMethod.login,
      ServiceProvider.SPOTIFY
    )).rejects.toThrow(error);

    expect(mockOAuthStateStore.set).not.toHaveBeenCalled();
  });
})