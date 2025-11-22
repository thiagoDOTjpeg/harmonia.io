import { OAuthState } from '@/types/oauth/state';
import { IStateStore } from '../../application/ports/oauth/IStateStore';

export class InMemoryStateStore implements IStateStore<OAuthState> {
  private store = new Map<string, OAuthState>();

  async get(state: string): Promise<OAuthState | undefined> {
    return this.store.get(state);
  }

  async set(key: string, value: OAuthState, expirationInSeconds: number): Promise<void> {
    this.store.set(key, value);
  }

  async delete(state: string): Promise<void> {
    this.store.delete(state);
  }
}