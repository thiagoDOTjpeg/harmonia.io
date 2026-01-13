import { logger } from '@/infrastructure/logger';
import Redis from 'ioredis';

export class RedisInstance {
  private static _instance: RedisInstance;
  private static redis: Redis;

  private REDIS_HOST: string = process.env.REDIS_HOST || "localhost"
  private REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379")
  private REDIS_USERNAME: string | undefined = process.env.REDIS_USERNAME
  private REDIS_PASSWORD: string | undefined = process.env.REDIS_PASSWORD
  private REDIS_DB: number = parseInt(process.env.REDIS_DB || "0")

  private constructor() {
    logger.info("RedisInstance created!!")
  }

  private initialize() {
    if (
      !this.REDIS_HOST ||
      !this.REDIS_PORT
    ) {
      logger.error("Redis .env isn't set");
    }
    RedisInstance.redis = new Redis({
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      username: this.REDIS_USERNAME,
      password: this.REDIS_PASSWORD,
      db: this.REDIS_DB,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true
    })
  }

  static getInstance() {
    if (!RedisInstance._instance) {
      RedisInstance._instance = new RedisInstance();
      RedisInstance._instance.initialize();
      RedisInstance._instance.setupEventListeners();
    }
    return RedisInstance._instance;
  }

  private setupEventListeners() {
    RedisInstance.redis.on('error', (err) => {
      logger.error({ err }, 'Redis connection error');
    });

    RedisInstance.redis.on('connect', () => {
      logger.info({ env: process.env.NODE_ENV }, 'Redis connected');
    });

    RedisInstance.redis.connect().catch((err) => {
      logger.error({ err }, 'Failed to connect to Redis');
    });
  }

  public getRedis() {
    return RedisInstance.redis;
  }
}

