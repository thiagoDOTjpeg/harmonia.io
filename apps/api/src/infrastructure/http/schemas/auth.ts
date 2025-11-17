import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { z } from "zod";

const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const OAuthQuerySchema = z.object({
  intent: z.enum([OAuthMethod.connect, OAuthMethod.login, OAuthMethod.register]),
  state: z.string()
    .regex(base64Regex, {
      message: "O state contém caracteres inválidos para Base64"
    })
    .refine((val) => val.length % 4 === 0, {
      message: "O state não tem um comprimento válido para Base64 (deve ser múltiplo de 4)"
    })
    .optional(),
  returnTo: z.string().url('URL inválida').optional(),
});

export const OAuthParamSchema = z.object({
  provider: z.enum([ServiceProvider.GOOGLE, ServiceProvider.SPOTIFY]),
});

export const OAuthParamCallbackSchema = z.object({
  code: z.string(),
  state: z.string()
})

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type OAuthQueryDto = z.infer<typeof OAuthQuerySchema>;