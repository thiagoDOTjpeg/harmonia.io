import { ITokenManager } from "@/application/ports/crypto/ITokenManager";

export const createMockTokenManager: jest.Mocked<ITokenManager> = {
  decode: jest.fn(),
  sign: jest.fn()
}