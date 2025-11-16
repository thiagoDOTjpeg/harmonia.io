import { IStateStore } from '../../application/ports/oauth/IStateStore';
import { redis } from '../db/redis/client';

export class RedisStateStore<T> implements IStateStore<T> {
  constructor(private readonly prefix: string) { }

  private buildKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async get(key: string): Promise<T | undefined> {
    try {
      const data = await redis.get(this.buildKey(key));
      if (!data) return undefined;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Redis get error:', error);
      return undefined;
    }
  }

  async set(key: string, value: T, expirationInSeconds: number): Promise<void> {
    try {
      await redis.setEx(this.buildKey(key), expirationInSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(this.buildKey(key));
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
}