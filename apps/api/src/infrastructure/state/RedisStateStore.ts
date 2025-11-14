import { OAuthState } from '@harmonia/shared';
import { IOAuthStateStore } from '../../application/ports/oauth/IOAuthStateStore';
import { redis } from '../db/redis/client';

export class RedisStateStore implements IOAuthStateStore {
  private readonly prefix = 'oauth:state:';
  private readonly ttl = 600; // 10 minutos

  private getKey(state: string): string {
    return `${this.prefix}${state}`;
  }

  async get(state: string): Promise<OAuthState | undefined> {
    try {
      const key = this.getKey(state);
      const data = await redis.get(key);

      if (!data) return undefined;

      return data as OAuthState;
    } catch (error) {
      console.error('Redis get error:', error);
      return undefined;
    }
  }

  async set(state: string, value: OAuthState): Promise<void> {
    try {
      const key = this.getKey(state);
      await redis.setex(key, this.ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  }

  async delete(state: string): Promise<void> {
    try {
      const key = this.getKey(state);
      await redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
}