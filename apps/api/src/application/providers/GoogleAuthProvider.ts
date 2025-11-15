import { ServiceConnection } from "@/domain/entities/ServiceConnection";
import { AppError, GoogleTokenResponse } from "@harmonia/shared";
import { IAuthProvider } from "../ports/auth/IAuthProvider";

export class GoogleAuthProvider implements IAuthProvider {
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
        const errorText = await response.text();
        console.error('Erro ao revogar token do Google:', errorText);
        throw new AppError(`Falha ao revogar token: ${response.status} ${response.statusText}`);
      }

      console.log('Token do Google revogado com sucesso');
    } catch (error) {
      console.error('Erro ao revogar token:', error);
      throw new AppError("Erro ao revogar acesso do Google");
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
      throw new Error("Refresh Token é inválido")
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
      throw new Error("Erro ao reautenticar tokens")
    }
  }

}