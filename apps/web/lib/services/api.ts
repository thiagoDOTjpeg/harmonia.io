const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: 'unknown_error',
      message: 'Erro desconhecido',
    }));

    throw new ApiError(
      response.status,
      error.code || 'unknown_error',
      error.message || 'Erro ao processar requisição',
      error.details
    );
  } else if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}