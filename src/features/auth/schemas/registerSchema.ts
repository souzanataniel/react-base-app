import {z} from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  email: z
    .email('E-mail inválido')
    .min(1, 'E-mail é obrigatório')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve ter ao menos: 1 minúscula, 1 maiúscula e 1 número'),

  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),

  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Você deve aceitar os termos de uso'),
})
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });
