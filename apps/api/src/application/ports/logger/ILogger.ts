/**
 * Interface de abstração para logging.
 * Permite trocar a implementação de logging (Pino, Winston, Bunyan, etc.)
 * sem refatorar todo o código que consome o logger.
 */
export interface ILogger {
  /**
   * Log de nível debug - informações detalhadas para debugging
   */
  debug(msg: string, obj?: Record<string, unknown>): void;
  debug(obj: Record<string, unknown>, msg?: string): void;

  /**
   * Log de nível info - informações gerais sobre o fluxo da aplicação
   */
  info(msg: string, obj?: Record<string, unknown>): void;
  info(obj: Record<string, unknown>, msg?: string): void;

  /**
   * Log de nível warn - situações potencialmente problemáticas
   */
  warn(msg: string, obj?: Record<string, unknown>): void;
  warn(obj: Record<string, unknown>, msg?: string): void;

  /**
   * Log de nível error - erros que não impedem a aplicação de continuar
   */
  error(msg: string, obj?: Record<string, unknown>): void;
  error(obj: Record<string, unknown>, msg?: string): void;

  /**
   * Log de nível fatal - erros críticos que causam encerramento da aplicação
   */
  fatal(msg: string, obj?: Record<string, unknown>): void;
  fatal(obj: Record<string, unknown>, msg?: string): void;

  /**
   * Cria um logger filho com bindings adicionais.
   * Útil para adicionar contexto específico (ex: módulo, userId, etc.)
   */
  child(bindings: Record<string, unknown>): ILogger;
}
