import { IAuthUrlProviderFactory } from "@/application/ports/factory/IAuthUrlProviderFactory";
import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";

export const createMockAuthUrlProvider = (): jest.Mocked<IAuthUrlProvider> => ({
  buildAuthUrl: jest.fn()
})

export const createMockAuthUrlFactory = (): jest.Mocked<IAuthUrlProviderFactory> => ({
  getStrategy: jest.fn()
})