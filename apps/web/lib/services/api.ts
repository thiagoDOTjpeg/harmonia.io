const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getApiUrl(): string {
  if (typeof window === "undefined") {
    return RAW_API_URL;
  }

  try {
    const url = new URL(RAW_API_URL);
    const currentHost = window.location.hostname;

    const isLoopbackUrl =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isLoopbackWindow =
      currentHost === "localhost" || currentHost === "127.0.0.1";

    // Garante que frontend e API usem o mesmo host (localhost vs 127.0.0.1)
    // para que cookies SameSite=Lax sejam enviados em todas as requisições fetch
    if (isLoopbackUrl && isLoopbackWindow && url.hostname !== currentHost) {
      url.hostname = currentHost;
      return url.origin;
    }

    return url.origin;
  } catch {
    return RAW_API_URL;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const AUTH_SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/request-access",
  "/auth/request-reset",
  "/auth/reset-password",
];

let refreshPromise: Promise<boolean> | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(callback: (() => void) | null) {
  onUnauthorizedCallback = callback;
}

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (
    response.status === 401 &&
    !isRetry &&
    !AUTH_SKIP_REFRESH_ENDPOINTS.some((skip) => endpoint.startsWith(skip))
  ) {
    const refreshed = await tryRefreshToken();

    if (refreshed) {
      return fetchApi<T>(endpoint, options, true);
    }

    onUnauthorizedCallback?.();
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: "unknown_error",
      message: "Erro desconhecido",
    }));

    throw new ApiError(
      response.status,
      error.code || "unknown_error",
      error.message || "Erro ao processar requisição",
      error.details,
    );
  } else if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
