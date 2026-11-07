import { RequestContext } from "@/infrastructure/context";
import { logger } from "@/infrastructure/logger";
import { ERRORS } from "@/types/constant/errors";
import {
  AppError,
  InvalidCredentialsError,
  NotFoundError,
  UnathorizedError,
} from "@harmonia/shared";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../domain/entities/User";
import { Container } from "../../../../main/container";
import { ACCESS_TOKEN_COOKIE, parseCookies } from "../utils/cookies";

export class AuthMiddleware {
  static extractAccessToken(req: Request): string {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies[ACCESS_TOKEN_COOKIE]) {
      return cookies[ACCESS_TOKEN_COOKIE];
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnathorizedError("Token não fornecido");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnathorizedError("Formato do token inválido");
    }

    return parts[1];
  }

  static authenticate(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = AuthMiddleware.extractAccessToken(req);
      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);

      RequestContext.setUserId(decoded.token.sub);

      next();
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof UnathorizedError
      ) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "JsonWebTokenError" ||
          error.name === "TokenExpiredError")
      ) {
        throw new UnathorizedError(ERRORS.INVALID_TOKEN);
      }

      logger.error({ err: error }, "Auth middleware unexpected crash");
      throw new AppError("Erro interno de autenticação");
    }
  }

  static async getAuthenticatedUser(
    req: Request,
    _res: Response,
  ): Promise<User> {
    try {
      const token = AuthMiddleware.extractAccessToken(req);

      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);
      if ("error" in decoded) {
        throw new UnathorizedError("Token inválido ou expirado");
      }

      const userRepository = Container.getUserRepository();
      const user = await userRepository.findByUserId(decoded.token.sub);
      if (!user) throw new NotFoundError("Usuário do token não existe");
      return user;
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof UnathorizedError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "JsonWebTokenError" ||
          error.name === "TokenExpiredError")
      ) {
        throw new UnathorizedError(ERRORS.INVALID_TOKEN);
      }

      logger.error({ err: error }, "Auth middleware error");
      throw new AppError("Erro ao autenticar");
    }
  }
}
