import { OAuthState } from "../../../legacy/types";

export interface IOAuthStateStore {
  get(state: string): OAuthState | undefined;
  set(state: string, value: OAuthState): void;
  delete(state: string): void;
}