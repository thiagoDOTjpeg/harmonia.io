import { Redis as UpstashRedis } from '@upstash/redis';
import Redis from 'ioredis';

let redis: Redis | UpstashRedis;

console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 REDIS_URL exists:', !!process.env.REDIS_URL);

if (process.env.NODE_ENV === "dev") {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected (dev)');
  });
} else {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error('❌ UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN devem estar definidas');
  }

  console.log('🔍 Conectando no Upstash Redis:', redisUrl);

  redis = new UpstashRedis({
    url: redisUrl,
    token: redisToken,
  });

  console.log('✅ Upstash Redis configurado');
}

export { redis };
