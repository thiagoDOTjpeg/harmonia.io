import { IOAuthCallbackFactory } from "@/application/ports/strategy/oauth/IOAuthCallbackFactory";

export const createMockOAuthStrategyFactory = (): jest.Mocked<IOAuthCallbackFactory> => ({
  getStrategy: jest.fn()
})