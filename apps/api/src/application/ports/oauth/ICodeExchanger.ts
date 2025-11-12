export interface ICodeExchanger<T> {
  exchangeCode(code: string): Promise<T>;

}