import { IOAuthStateStore } from '../../application/ports/oauth/IOAuthStateStore';
import { OAuthState } from '@harmonia/shared';

export class InMemoryStateStore implements IOAuthStateStore {
  private store = new Map<string, OAuthState>();

  async get(state: string): Promise<OAuthState | undefined> {
    return this.store.get(state);
  }

  async set(state: string, value: OAuthState): Promise<void> {
    this.store.set(state, value);
  }

  async delete(state: string): Promise<void> {
    this.store.delete(state);
  }
}