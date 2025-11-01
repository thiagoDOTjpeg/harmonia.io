import jwt from 'jsonwebtoken';
import { ITokenManager } from '../../application/ports/crypto/ITokenManager';

export class JwtTokenManager implements ITokenManager {
  private readonly secret = process.env.JWT_SECRET || 'dev-secret';
  private readonly expiresIn = '7d';

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
}