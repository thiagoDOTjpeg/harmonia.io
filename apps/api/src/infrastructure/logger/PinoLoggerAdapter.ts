import { ILogger } from '@/application/ports/logger/ILogger';
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

export class PinoLoggerAdapter implements ILogger {
  private readonly pino: PinoLogger;

  constructor(pinoInstance?: PinoLogger) {
    this.pino = pinoInstance ?? pino(loggerOptions);
  }

  debug(msgOrObj: string | Record<string, unknown>, msgOrUndefined?: string | Record<string, unknown>): void {
    if (typeof msgOrObj === 'string') {
      if (msgOrUndefined && typeof msgOrUndefined === 'object') {
        this.pino.debug(msgOrUndefined, msgOrObj);
      } else {
        this.pino.debug(msgOrObj);
      }
    } else {
      this.pino.debug(msgOrObj, msgOrUndefined as string | undefined);
    }
  }

  info(msgOrObj: string | Record<string, unknown>, msgOrUndefined?: string | Record<string, unknown>): void {
    if (typeof msgOrObj === 'string') {
      if (msgOrUndefined && typeof msgOrUndefined === 'object') {
        this.pino.info(msgOrUndefined, msgOrObj);
      } else {
        this.pino.info(msgOrObj);
      }
    } else {
      this.pino.info(msgOrObj, msgOrUndefined as string | undefined);
    }
  }

  warn(msgOrObj: string | Record<string, unknown>, msgOrUndefined?: string | Record<string, unknown>): void {
    if (typeof msgOrObj === 'string') {
      if (msgOrUndefined && typeof msgOrUndefined === 'object') {
        this.pino.warn(msgOrUndefined, msgOrObj);
      } else {
        this.pino.warn(msgOrObj);
      }
    } else {
      this.pino.warn(msgOrObj, msgOrUndefined as string | undefined);
    }
  }

  error(msgOrObj: string | Record<string, unknown>, msgOrUndefined?: string | Record<string, unknown>): void {
    if (typeof msgOrObj === 'string') {
      if (msgOrUndefined && typeof msgOrUndefined === 'object') {
        this.pino.error(msgOrUndefined, msgOrObj);
      } else {
        this.pino.error(msgOrObj);
      }
    } else {
      this.pino.error(msgOrObj, msgOrUndefined as string | undefined);
    }
  }

  fatal(msgOrObj: string | Record<string, unknown>, msgOrUndefined?: string | Record<string, unknown>): void {
    if (typeof msgOrObj === 'string') {
      if (msgOrUndefined && typeof msgOrUndefined === 'object') {
        this.pino.fatal(msgOrUndefined, msgOrObj);
      } else {
        this.pino.fatal(msgOrObj);
      }
    } else {
      this.pino.fatal(msgOrObj, msgOrUndefined as string | undefined);
    }
  }

  child(bindings: Record<string, unknown>): ILogger {
    return new PinoLoggerAdapter(this.pino.child(bindings));
  }

  getRawPino(): PinoLogger {
    return this.pino;
  }
}

const loggerInstance = new PinoLoggerAdapter();

export const logger = loggerInstance;

export const pinoInstance = loggerInstance.getRawPino();

export type { ILogger };
