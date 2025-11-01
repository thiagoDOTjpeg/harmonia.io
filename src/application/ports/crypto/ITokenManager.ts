export interface ITokenManager {
  sign(payload: object): string;
}