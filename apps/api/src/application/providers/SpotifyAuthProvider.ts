import { ILogger } from "@/application/ports/logger/ILogger";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ERRORS } from "@/types/constant/errors";
import { SpotifyTokenResponse } from "@/types/spotify";
import { IAuthProvider } from "../ports/auth/IAuthProvider";

export class SpotifyAuthProvider implements IAuthProvider {
  constructor(private readonly logger: ILogger) { }

  revokeToken(accessToken: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public isExpired(serviceConnection: ServiceConnection): boolean {
    if (!serviceConnection.expiresAt) {
      throw new Error(ERRORS.INVALID_TOKEN)
    }
    return serviceConnection.expiresAt > new Date() ? false : true;
  }

  public async refreshToken(refreshToken: string | null): Promise<SpotifyTokenResponse> {
    if (!refreshToken) {
      throw new Error(ERRORS.INVALID_TOKEN)
    }
    try {
      const clientId = process.env.SPOTIFY_CLIENT_ID || ""
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || ""
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${basic}`
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId
        })
      };
      const response = await fetch("https://accounts.spotify.com/api/token", requestOptions)
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error({ error: errorText }, 'Spotify token refresh failed');
      }

      const json = await response.json() as SpotifyTokenResponse;
      return json;
    } catch (error) {
      throw new Error(ERRORS.REAUTH_TOKEN)
    }
  }
}