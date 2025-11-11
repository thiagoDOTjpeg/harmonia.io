import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { SpotifyTokenResponse } from "@harmonia/shared";

export interface IAuthProvider {
  isExpired(serviceConnection: ServiceConnection): boolean;
  refreshToken(refreshToken: string | null): Promise<SpotifyTokenResponse>;
}