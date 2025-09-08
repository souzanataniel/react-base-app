import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .email('E-mail inválido')
    .min(1, 'E-mail é obrigatório')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
  rememberMe: z.boolean().optional().default(false),
});
