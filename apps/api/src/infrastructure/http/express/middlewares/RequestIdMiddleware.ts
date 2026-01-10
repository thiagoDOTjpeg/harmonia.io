import { RequestContext } from '@/infrastructure/context/RequestContext';
import { logger } from '@/infrastructure/logger';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export class RequestIdMiddleware {
  static handle(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();

    res.setHeader('x-request-id', requestId);

    RequestContext.run({ requestId }, () => {
      logger.info(
        {
          method: req.method,
          url: req.url,
          userAgent: req.headers['user-agent'],
        },
        'Incoming request'
      );

      res.on('finish', () => {
        logger.info(
          {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
          },
          'Request completed'
        );
      });

      next();
    });
  }
}
