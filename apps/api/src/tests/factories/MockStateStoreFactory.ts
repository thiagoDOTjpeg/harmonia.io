import { IStateStore } from "@/application/ports/oauth/IStateStore";

export const createMockStateStore = <T>(): jest.Mocked<IStateStore<T>> => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn()
})
