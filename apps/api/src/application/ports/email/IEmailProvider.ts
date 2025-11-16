export interface IEmailProvider {
  sendResetPasswordEmail(outputEmail: string, randomCode: number): Promise<void>
}