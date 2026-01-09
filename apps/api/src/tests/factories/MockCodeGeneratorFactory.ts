import { ICodeGenerator } from "@/application/ports/crypto/ICodeGenerator";

export const createMockCodeGeneratorFactory = (): jest.Mocked<ICodeGenerator> => ({
  generateResetPasswordCode: jest.fn(),
  generateState: jest.fn()
})