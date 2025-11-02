import { OAuthState } from '@harmonia/shared';

export interface IOAuthStateStore {
  get(state: string): Promise<OAuthState | undefined>;
  set(state: string, value: OAuthState): Promise<void>;
  delete(state: string): Promise<void>;
}