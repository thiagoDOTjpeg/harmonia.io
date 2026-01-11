import { ILogger } from "@/application/ports/logger/ILogger";
import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { ERRORS } from "@/types/constant/errors";
import { GoogleTokenResponse } from "@/types/google";
import { AppError } from "@harmonia/shared";
import { IAuthProvider } from "../ports/auth/IAuthProvider";

export class GoogleAuthProvider implements IAuthProvider {
  constructor(private readonly logger: ILogger) { }

  async revokeToken(accessToken: string): Promise<void> {
    const postData = `token=${accessToken}`;

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData).toString()
      },
      body: postData
    };

    try {
      const response = await fetch("https://oauth2.googleapis.com/revoke", requestOptions);

      if (!response.ok) {
        throw new AppError(ERRORS.GOOGLE_REVOKE_TOKEN);
      }

      this.logger.info('Google token revoked successfully');
    } catch (error) {
      this.logger.error({ err: error }, 'Error revoking Google token');
      throw error;
    }
  }

  public isExpired(serviceConnection: ServiceConnection): boolean {
    if (!serviceConnection.expiresAt) {
      throw new Error("Data de expiração do token é inválida")
    }
    return serviceConnection.expiresAt > new Date() ? false : true;
  }

  public async refreshToken(refreshToken: string | null): Promise<GoogleTokenResponse> {
    if (!refreshToken) {
      throw new Error(ERRORS.INVALID_TOKEN)
    }
    const clientId = process.env.GOOGLE_CLIENT_ID || ""
    const secretId = process.env.GOOGLE_CLIENT_SECRET || ""
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: secretId
        })
      };
      const response = await fetch("https://oauth2.googleapis.com/token", requestOptions)
      const json = await response.json() as GoogleTokenResponse;
      return json;
    } catch (error) {
      throw new Error(ERRORS.REAUTH_TOKEN)
    }
  }

}