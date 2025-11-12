import { AppError, NotFoundError, UnathorizedError } from "@harmonia/shared";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../domain/entities/User";
import { Container } from "../../../../main/container";

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnathorizedError("Token não fornecido")


      const parts = authHeader?.split(" ");
      if (parts?.length !== 2 || parts[0] !== "Bearer") throw new UnathorizedError("Formato do token inválido")

      const token = parts[1];

      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);
      if ("error" in decoded) throw new UnathorizedError("Token inválido ou expirado")
      next();
    } catch (error) {
      console.error("Auth middleware error: ", error);
      throw new AppError("Erro ao autenticar")
    }
  }

  static async getAuthenticatedUser(req: Request, res: Response): Promise<User> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnathorizedError("Token não fornecido")

      const parts = authHeader?.split(" ");
      if (parts?.length !== 2 || parts[0] !== "Bearer") throw new UnathorizedError("Formato do token inválido")

      const token = parts[1];

      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);
      if ("error" in decoded) throw new UnathorizedError("Token inválido ou expirado")

      const userRepository = Container.getUserRepository();
      const user = await userRepository.findByUserId(decoded.token.sub);
      if (!user) throw new NotFoundError("Usuário do token não existe")
      return user;
    } catch (error) {
      console.error("Auth middleware error: ", error);
      throw new AppError("Erro ao autenticar")
    }
  }
}