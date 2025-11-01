import { IOAuthStateStore } from '../../application/ports/oauth/IOAuthStateStore';
import { OAuthState } from '../../shared/types/oauth/oauth';

export class InMemoryStateStore implements IOAuthStateStore {
  private store = new Map<string, OAuthState>();

  get(state: string): OAuthState | undefined {
    return this.store.get(state);
  }
  set(state: string, value: OAuthState): void {
    this.store.set(state, value);
  }
  delete(state: string): void {
    this.store.delete(state);
  }
}