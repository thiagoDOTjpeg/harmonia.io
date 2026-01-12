export interface ILogger {

  debug(msg: string, obj?: Record<string, unknown>): void;
  debug(obj: Record<string, unknown>, msg?: string): void;

  info(msg: string, obj?: Record<string, unknown>): void;
  info(obj: Record<string, unknown>, msg?: string): void;

  warn(msg: string, obj?: Record<string, unknown>): void;
  warn(obj: Record<string, unknown>, msg?: string): void;

  error(msg: string, obj?: Record<string, unknown>): void;
  error(obj: Record<string, unknown>, msg?: string): void;

  fatal(msg: string, obj?: Record<string, unknown>): void;
  fatal(obj: Record<string, unknown>, msg?: string): void;

  child(bindings: Record<string, unknown>): ILogger;
}
