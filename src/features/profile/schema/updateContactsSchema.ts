import {z} from 'zod';

export const updateContactsSchema = z.object({
  phone: z
    .string({message: 'Telefone é obrigatório'})
    .min(1, 'Telefone é obrigatório')
    .refine((value) => {
      const cleaned = value.replace(/\D/g, '');

      if (cleaned.length < 10 || cleaned.length > 11) {
        return false;
      }

      if (cleaned.length === 11 && !cleaned.startsWith('9', 2)) {
        return false;
      }

      return true;
    }, 'Telefone deve ter formato válido: (11) 99999-9999')
    .transform((value) => {
      return value.replace(/\D/g, '');
    }),


  email: z
    .email()
    .transform((value) => value.trim())
});

export type UpdateContatcsFormData = z.infer<typeof updateContactsSchema>;
