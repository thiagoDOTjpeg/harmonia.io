import z from "zod";

export const RequestAccessSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  reason: z.string().min(10, "Descreva melhor o motivo do pedido"),
});

export type RequestAccessDTO = z.infer<typeof RequestAccessSchema>;