import {z} from 'zod';

export const updateProfileSchema = z.object({
  firstName: z
    .string({message: 'Nome é obrigatório'})
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
    .transform((value) => value.trim()),

  lastName: z
    .string({message: 'Sobrenome é obrigatório'})
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Sobrenome deve conter apenas letras')
    .transform((value) => value.trim()),

  displayName: z
    .string()
    .min(2, 'Nome de exibição deve ter pelo menos 2 caracteres')
    .max(50, 'Nome de exibição muito longo')
    .transform((value) => value.trim())
    .optional()
    .or(z.literal('')), // Permite string vazia

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

  dateOfBirth: z
    .string()
    .refine((value) => {
      if (!value || value === '') return true; // Campo opcional

      // Valida formato DD/MM/AAAA
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(value)) return false;

      // Valida se é uma data válida
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      return date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year &&
        year >= 1900 &&
        year <= new Date().getFullYear();
    }, 'Data deve estar no formato DD/MM/AAAA e ser válida')
    .optional()
    .or(z.literal('')), // Permite string vazia
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;

// Schemas individuais para validação campo a campo
export const firstNameUpdateSchema = updateProfileSchema.shape.firstName;
export const lastNameUpdateSchema = updateProfileSchema.shape.lastName;
export const displayNameUpdateSchema = updateProfileSchema.shape.displayName;
export const phoneUpdateSchema = updateProfileSchema.shape.phone;
export const dateOfBirthUpdateSchema = updateProfileSchema.shape.dateOfBirth;
