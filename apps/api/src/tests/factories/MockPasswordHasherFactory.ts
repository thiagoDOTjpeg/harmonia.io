import { IHasher } from "@/application/ports/crypto/IHasher";

export const createMockPasswordHasher = (): jest.Mocked<IHasher> => ({
  hash: jest.fn(),
  verify: jest.fn()
})