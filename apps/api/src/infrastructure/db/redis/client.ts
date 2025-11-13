import Redis from 'ioredis';

let redis: Redis;
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
} else {
  redis = new Redis(process.env.REDIS_URL || "")
}


redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected, ambiente:', process.env.NODE_ENV);
});

export { redis };
