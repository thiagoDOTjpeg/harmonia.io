import { AsyncLocalStorage } from 'async_hooks';

export interface RequestStore {
  requestId: string;
  correlationId?: string;
  userId?: string;
}

class RequestContextManager {
  private static instance: RequestContextManager;
  private storage: AsyncLocalStorage<RequestStore>;

  private constructor() {
    this.storage = new AsyncLocalStorage<RequestStore>();
  }

  static getInstance(): RequestContextManager {
    if (!RequestContextManager.instance) {
      RequestContextManager.instance = new RequestContextManager();
    }
    return RequestContextManager.instance;
  }

  run<T>(store: RequestStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  getStore(): RequestStore | undefined {
    return this.storage.getStore();
  }

  getRequestId(): string | undefined {
    return this.getStore()?.requestId;
  }

  getCorrelationId(): string | undefined {
    return this.getStore()?.correlationId;
  }

  getUserId(): string | undefined {
    return this.getStore()?.userId;
  }

  setUserId(userId: string): void {
    const store = this.getStore();
    if (store) {
      store.userId = userId;
    }
  }
}

export const RequestContext = RequestContextManager.getInstance();
