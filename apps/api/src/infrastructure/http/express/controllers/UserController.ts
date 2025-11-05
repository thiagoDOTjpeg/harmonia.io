import { User } from '@/domain/entities/User';
import { Container } from '@/main/container';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class UserController {
  static async getDashboardSummary(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) {
        return res.status(400).json({
          error: "user_not_found",
          message: "Usuário não encontrado"
        })
      }
      const summary = await Container.getUserRepository().getUserDashboard(user.id);

      if (!summary) {
        return res.status(400).json({
          error: "summary_dashboard_not_found",
          message: "Resumo não encontrado"
        })
      }

      const convertBigInt = (value: any): any => {
        if (typeof value === "bigint") return value.toString();
        if (Array.isArray(value)) return value.map(convertBigInt);
        if (value && typeof value === "object") {
          const out: Record<string, any> = {};
          for (const key of Object.keys(value)) {
            out[key] = convertBigInt(value[key]);
          }
          return out;
        }
        return value;
      };

      const safeSummary = convertBigInt(summary);

      return res.json(safeSummary)
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
