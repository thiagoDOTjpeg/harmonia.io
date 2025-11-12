export interface ITokenSerializer<T> {
  serialize(data: T): string;
  deserialize(data: string | null): T;
}