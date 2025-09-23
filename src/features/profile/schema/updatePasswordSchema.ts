import {z} from 'zod';

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória')
    .min(6, 'Senha atual deve ter pelo menos 6 caracteres'),

  newPassword: z
    .string()
    .min(1, 'Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres')
   ,

  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'A nova senha deve ser diferente da senha atual',
  path: ['newPassword'],
});


export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
