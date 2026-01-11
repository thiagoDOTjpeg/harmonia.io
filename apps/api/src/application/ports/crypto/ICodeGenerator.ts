export interface ICodeGenerator {
  generateState(): string;
  generateResetPasswordCode(): string;
}