import { IEmailProvider } from "@/application/ports/email/IEmailProvider";

export const createMockEmailProvider = (): jest.Mocked<IEmailProvider> => ({
  sendResetPasswordEmail: jest.fn()
})