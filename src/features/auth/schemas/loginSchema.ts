import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .email({message: 'E-mail Inválido.'})
    .min(1, {message: 'O E-mail é Obrigatório.'})
    .transform((value) => value.toLowerCase().trim()),

  password: z
    .string({message: 'Senha deve ser um texto'})
    .min(6, {message: 'A Senha deve ter pelo menos 6 caracteres'})
    .max(100, {message: 'Senha muito longa'})
});

export type SignInFormData = z.infer<typeof loginSchema>;
export type SignInInput = z.input<typeof loginSchema>;

export const emailSchema = loginSchema.shape.email;
export const passwordSchema = loginSchema.shape.password;
