import { OAuthMethod } from "../../enum/oauth";

export interface AuthSuccess {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  method?: OAuthMethod;
  returnTo?: string;
}

export type AuthResponse = AuthSuccess;