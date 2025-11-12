export interface IAuthUrlProvider {
  buildAuthUrl(state: string): string;
}