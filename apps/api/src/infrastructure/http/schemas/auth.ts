import { z } from "zod";

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
  returnTo: z.string().url('URL inválida').optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type OAuthQueryDto = z.infer<typeof OAuthQuerySchema>;