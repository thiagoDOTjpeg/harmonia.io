import { StartOAuthUseCase } from "@/application/use_cases/auth/StartOAuthUseCase";
import { OAuthState } from "@/types/oauth/state";
import { OAuthMethod } from "@harmonia/shared";
import { createMockAuthUrlProvider } from "../factories/MockAuthUrlProviderFactory";
import { createMockOAuthStateStore } from "../factories/MockStateStoreFactory";

describe("Start OAuth Use Case", () => {
  let useCase: StartOAuthUseCase;
  const mockOAuthStateStore = createMockOAuthStateStore;
  const mockAuthUrlProvider = createMockAuthUrlProvider;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new StartOAuthUseCase(mockOAuthStateStore);
  })

  it("should return redirect to sucessfully", async () => {
    const redirectToValue = "http://redirectTo.com.br"
    mockAuthUrlProvider.buildAuthUrl.mockImplementation(() => { return redirectToValue })

    const mockState: OAuthState = {
      method: OAuthMethod.connect,
      returnTo: "http://returnto.com.br",
      userId: "userid-123,"
    }

    const { redirectTo } = await useCase.execute(OAuthMethod.connect, mockAuthUrlProvider, mockState.returnTo, mockState.userId);


    expect(redirectTo).toBe(redirectToValue);
    expect(mockOAuthStateStore.set).toHaveBeenCalledTimes(1);
    expect(mockAuthUrlProvider.buildAuthUrl).toHaveBeenCalledTimes(1);
  })
})