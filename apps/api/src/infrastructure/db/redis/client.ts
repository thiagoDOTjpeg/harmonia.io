import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.NODE_ENV === "dev"
      ? (process.env.REDIS_HOST || 'localhost')
      : undefined,
    port: process.env.NODE_ENV === "dev"
      ? parseInt(process.env.REDIS_PORT || '6379')
      : undefined,
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 2000);
      return delay;
    },
  },
  database: parseInt(process.env.REDIS_DB || '0'),
  url: process.env.NODE_ENV !== "dev" ? process.env.REDIS_URL : undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected, ambiente:', process.env.NODE_ENV);
});

// Conectar ao Redis
redisClient.connect().catch(console.error);

export { redisClient as redis };
