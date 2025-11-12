export interface AuthSuccess {
  success: true;
  token: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  returnTo?: string;
}

export type AuthResponse = AuthSuccess;