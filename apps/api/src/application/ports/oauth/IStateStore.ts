export interface IStateStore<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, expirationInSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}