import { OAuthMethod } from "../../enum/oauth";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  method?: OAuthMethod;
  returnTo?: string;
}
