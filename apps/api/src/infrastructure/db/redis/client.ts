import { logger } from '@/infrastructure/logger';
import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 2000);
      return delay;
    },
  },
  database: parseInt(process.env.REDIS_DB || '0'),
});

redisClient.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});

redisClient.on('connect', () => {
  logger.info({ env: process.env.NODE_ENV }, 'Redis connected');
});

redisClient.connect().catch((err) => {
  logger.error({ err }, 'Failed to connect to Redis');
});

export { redisClient as redis };
