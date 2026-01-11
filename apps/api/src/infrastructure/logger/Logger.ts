import pino, { LoggerOptions, Logger as PinoLogger } from 'pino';
import { RequestContext } from '../context/RequestContext';

const isDevelopment = process.env.NODE_ENV === 'dev';

const baseOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label) => ({ level: label }),
  },
  mixin: () => {
    const store = RequestContext.getStore();
    if (store) {
      return {
        requestId: store.requestId,
        ...(store.correlationId && { correlationId: store.correlationId }),
        ...(store.userId && { userId: store.userId }),
      };
    }
    return {};
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const developmentOptions: LoggerOptions = {
  ...baseOptions,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
    },
  },
};

const productionOptions: LoggerOptions = {
  ...baseOptions,
};

const loggerOptions = isDevelopment ? developmentOptions : productionOptions;

export const logger: PinoLogger = pino(loggerOptions);

export type Logger = PinoLogger;

export function createChildLogger(bindings: Record<string, unknown>): PinoLogger {
  return logger.child(bindings);
}
