import { ILogger } from '@/application/ports/logger/ILogger';
import Redis from 'ioredis';
import { IStateStore } from '../../application/ports/oauth/IStateStore';

export class RedisStateStore<T> implements IStateStore<T> {
  constructor(
    private readonly prefix: string,
    private readonly logger: ILogger,
    private readonly redis: Redis
  ) { }

  private buildKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async get(key: string): Promise<T | undefined> {
    try {
      const data = await this.redis.get(this.buildKey(key));
      if (!data) return undefined;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error({ err: error, key }, 'Redis get error');
      return undefined;
    }
  }

  async set(key: string, value: T, expirationInSeconds: number): Promise<void> {
    try {
      await this.redis.setex(this.buildKey(key), expirationInSeconds, JSON.stringify(value));
    } catch (error) {
      this.logger.error({ err: error, key }, 'Redis set error');
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.buildKey(key));
    } catch (error) {
      this.logger.error({ err: error, key }, 'Redis delete error');
    }
  }
}