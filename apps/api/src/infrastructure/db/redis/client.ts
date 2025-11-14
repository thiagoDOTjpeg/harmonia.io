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
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected, ambiente:', process.env.NODE_ENV);
});

redisClient.connect().catch(console.error);

export { redisClient as redis };
