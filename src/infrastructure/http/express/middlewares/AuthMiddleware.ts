import { NextFunction, Request, Response } from "express";
import { User } from "../../../../domain/entities/User";
import { Container } from "../../../../main/container";

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "missing_token", message: "Token não fornecido" })

      const parts = authHeader?.split(" ");
      if (parts?.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "invalid_token_format", message: "Formato do token inválido" })

      const token = parts[1];

      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);
      if ("error" in decoded) return res.status(401).json({ error: "invalid_token", message: "Token inválido ou expirado" });
      next();
    } catch (error) {
      console.error("Auth middleware error: ", error);
      return res.status(500).json({ error: "auth_error", message: "Erro ao autenticar" });
    }
  }

  static async getAuthenticatedUser(req: Request, res: Response): Promise<User | Response> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "missing_token", message: "Token não fornecido" })

      const parts = authHeader?.split(" ");
      if (parts?.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "invalid_token_format", message: "Formato do token inválido" })

      const token = parts[1];

      const tokenManager = Container.getTokenManager();
      const decoded = tokenManager.decode(token);
      if ("error" in decoded) return res.status(401).json({ error: "invalid_token", message: "Token inválido ou expirado" });

      const userRepository = Container.getUserRepository();
      const user = await userRepository.findByUserId(decoded.token.sub);
      if (!user) return res.status(404).json({ error: "invalid_token", message: "Usuário do token não existe" });
      return user;
    } catch (error) {
      console.error("Auth middleware error: ", error);
      return res.status(500).json({ error: "auth_error", message: "Erro ao autenticar" });
    }
  }
}