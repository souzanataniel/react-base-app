import {z} from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .email({message: 'E-mail é obrigatório'})
    .min(1, 'E-mail é obrigatório')
    .transform((value) => value.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  password: z
    .string({message: 'Senha deve ser um texto'})
    .min(6, {message: 'A Senha deve ter pelo menos 6 caracteres'})
    .max(100, {message: 'Senha muito longa'}),

  confirmPassword: z
    .string({message: 'Confirmação de senha é obrigatória'})
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas devem ser iguais',
  path: ['confirmPassword'],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const emailSchema = forgotPasswordSchema.shape.email;
