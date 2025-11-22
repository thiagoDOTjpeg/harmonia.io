import { ServiceProvider } from "@harmonia/shared";
import z from "zod";

export const OAuthParamSchema = z.object({
  provider: z.enum([ServiceProvider.GOOGLE, ServiceProvider.SPOTIFY]),
});

export const OAuthParamCallbackSchema = z.object({
  code: z.string(),
  state: z.string()
})