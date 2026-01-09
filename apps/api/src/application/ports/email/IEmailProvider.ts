export interface IEmailProvider {
  sendResetPasswordEmail(outputEmail: string, randomCode: string): Promise<void>
}