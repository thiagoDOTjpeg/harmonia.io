import { IStateStore } from "@/application/ports/oauth/IStateStore";
import { OAuthState } from "@/types/oauth/state";

export const createMockOAuthStateStore: jest.Mocked<IStateStore<OAuthState>> = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn()
}