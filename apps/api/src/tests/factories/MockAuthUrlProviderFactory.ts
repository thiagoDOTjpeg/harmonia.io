import { IAuthUrlProvider } from "@/application/ports/oauth/IAuthUrlProvider";

export const createMockAuthUrlProvider: jest.Mocked<IAuthUrlProvider> = {
  buildAuthUrl: jest.fn((state: string) => { return "http://redirectTo.com.br" })
}