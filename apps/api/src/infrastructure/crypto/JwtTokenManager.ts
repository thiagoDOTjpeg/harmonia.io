import { TokenResponse } from '@/types/token';
import { InvalidCredentialsError } from '@harmonia/shared';
import jwt from 'jsonwebtoken';
import { ITokenManager } from '../../application/ports/crypto/ITokenManager';
export class JwtTokenManager implements ITokenManager {
  private readonly secret = process.env.JWT_SECRET || 'dev-secret';
  private readonly expiresIn = '7d';

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  decode(token: string): TokenResponse {
    const decodedJwt = jwt.verify(token, this.secret) as jwt.JwtPayload;
    if (!decodedJwt || !decodedJwt.sub) throw new InvalidCredentialsError("Credenciais do token inválidas");
    return {
      token: {
        sub: decodedJwt.sub.toString(),
        exp: decodedJwt?.exp?.toString(),
        iat: decodedJwt?.iat?.toString()
      }
    }
  }
}