import { User } from '@/domain/entities/User';
import { ServiceConnectionMapper } from '@/infrastructure/db/prisma/mapper/ServiceConnectionMapper';
import { UserSummaryMapper } from '@/infrastructure/db/prisma/mapper/UserSummaryMapper';
import { Container } from '@/main/container';
import { NotFoundError, UnathorizedError } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class UserController {
  static async getUserSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) {
        throw new UnathorizedError("Usuário não logado")

      }
      const summary = await Container.getUserRepository().getUserSummary(user.id)

      if (!summary) {
        throw new NotFoundError("Resumo não encontrado")
      }

      const summaryDTO = UserSummaryMapper.toDTO(summary);

      return res.json(summaryDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar o resumo", error);
      next(error)
    }
  }

  static async getUserConnections(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) {
        throw new UnathorizedError("Usuário não logado")
      }

      const serviceConnections = await Container.getServiceConnectionRepository().findAllByUserId(user.id);

      if (!serviceConnections) {
        throw new NotFoundError("Nenhum serviço conectado");
      }

      const serviceConnectionsDTO = serviceConnections.map((service) => {
        return ServiceConnectionMapper.toDTO(service);
      })

      return res.json(serviceConnectionsDTO)
    } catch (error) {
      console.error("Ocorreu um erro ao buscar os serviços do usuário", error);
      next(error)
    }
  }

  static async deleteServiceConnectionRevoke(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) {
        throw new UnathorizedError("Usuário não logado")
      }

      const { id } = req.params
      await Container.getRevokeServiceConnectionUseCase().execute(user.id, id);
      return res.status(204).send();
    } catch (error) {
      console.error("Ocorreu um erro ao revogar a conexão", error);
      next(error)
    }
  }
}
