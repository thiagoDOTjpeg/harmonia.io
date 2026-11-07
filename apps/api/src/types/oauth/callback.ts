import { ServiceProvider } from "@harmonia/shared";
import { Prisma } from "@prisma/client";

export type OAuthCallbackData = {
  code: string;
  state: string;
};

export interface OAuthNormalizedData {
  provider: ServiceProvider;
  providerAccountId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresIn: number;
  scopes: string;
  metadata?: Prisma.InputJsonValue;
  returnTo?: string;
}

export interface ConnectServiceInput extends OAuthNormalizedData {
  loggedUserId?: string;
}

