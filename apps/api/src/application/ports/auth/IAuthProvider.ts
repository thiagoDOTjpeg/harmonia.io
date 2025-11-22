import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { OAuthProviderToken } from "@/types/oauth/tokens";

export interface IAuthProvider {
  isExpired(serviceConnection: ServiceConnection): boolean;
  refreshToken(refreshToken: string | null): Promise<OAuthProviderToken>;
  revokeToken(accessToken: string): Promise<void>
}