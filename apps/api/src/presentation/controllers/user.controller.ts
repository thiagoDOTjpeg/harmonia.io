import { User } from '@/domain/entities/User';
import { ServiceConnectionMapper } from '@/infrastructure/db/prisma/mapper/ServiceConnectionMapper';
import { UserSummaryMapper } from '@/infrastructure/db/prisma/mapper/UserSummaryMapper';
import { logger } from '@/infrastructure/logger';
import { Container } from '@/main/container';
import { makeRevokeServiceConnectionUseCase } from '@/main/factories/service-connection.factory';
import { NotFoundError, UnathorizedError } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from '../../infrastructure/http/express/middlewares/AuthMiddleware';

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
      logger.error({ err: error }, 'Error fetching user summary');
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
      logger.error({ err: error }, 'Error fetching user connections');
      next(error)
    }
  }

  static async deleteServiceConnectionRevoke(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);

      const { id } = req.params
      await makeRevokeServiceConnectionUseCase().execute(user.id, id);
      return res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Error revoking service connection');
      next(error)
    }
  }
}
