import { OAuthState } from '@harmonia/shared';
import { IStateStore } from '../../application/ports/oauth/IStateStore';

export class InMemoryStateStore implements IStateStore<OAuthState> {
  private store = new Map<string, OAuthState>();

  async get(state: string): Promise<OAuthState | undefined> {
    return this.store.get(state);
  }

  async set(prefix: string, expiration: number, state: string, value: OAuthState): Promise<void> {
    this.store.set(state, value);
  }

  async delete(state: string): Promise<void> {
    this.store.delete(state);
  }
}