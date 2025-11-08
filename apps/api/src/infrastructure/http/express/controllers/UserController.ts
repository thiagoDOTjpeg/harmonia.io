import { User } from '@/domain/entities/User';
import { Container } from '@/main/container';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class UserController {
  static async getUserSummary(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) {
        return res.status(400).json({
          error: "user_not_found",
          message: "Usuário não encontrado"
        })
      }
      const summary = await Container.getUserRepository().getUserSummary(user.id)

      if (!summary) {
        return res.status(400).json({
          error: "user_summary_not_found",
          message: "Resumo não encontrado"
        })
      }

      return res.json(summary);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar o resumo", error);
      return res.status(500).json({
        error: "user_dashboard_failed",
        message: "Erro ao buscar o Resumo",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      })
    }
  }
}
