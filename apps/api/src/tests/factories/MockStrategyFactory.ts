import { OAuthCallbackStrategyFactory } from "@/infrastructure/adapter/oauth/factory/OAuthCallbackStrategyFactory";

export const createMockOAuthStrategyFactory = (): jest.Mocked<OAuthCallbackStrategyFactory> => {
  return {
    create: jest.fn(),
  } as unknown as jest.Mocked<OAuthCallbackStrategyFactory>;
}