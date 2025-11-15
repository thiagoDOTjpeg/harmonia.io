import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { OAuthProviderToken } from "@harmonia/shared";

export interface IAuthProvider {
  isExpired(serviceConnection: ServiceConnection): boolean;
  refreshToken(refreshToken: string | null): Promise<OAuthProviderToken>;
  revokeToken(accessToken: string): Promise<void>
}