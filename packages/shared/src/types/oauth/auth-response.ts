export interface AuthSuccess {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  returnTo?: string;
}

export type AuthResponse = AuthSuccess;