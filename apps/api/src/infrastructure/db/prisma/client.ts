import { logger } from '@/infrastructure/logger';
import { Prisma, PrismaClient } from '@prisma/client';

const isDevelopment = process.env.NODE_ENV === 'development';

export const prisma = new PrismaClient({
  log: isDevelopment
    ? [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ]
    : [{ emit: 'event', level: 'error' }],
});

if (isDevelopment) {
  prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    logger.debug(
      {
        query: e.query,
        params: e.params,
        durationMs: e.duration,
      },
      'Prisma query'
    );
  });
}

prisma.$on('error' as never, (e: { message: string; target?: string }) => {
  logger.error({ err: new Error(e.message), target: e.target }, 'Prisma error');
});

prisma.$on('warn' as never, (e: { message: string }) => {
  logger.warn({ message: e.message }, 'Prisma warning');
});