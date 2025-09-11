import {z} from 'zod';

export const registerSchema = z.object({
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
    .email({message: 'E-mail é obrigatório'})
    .min(1, 'E-mail é obrigatório')
    .transform((value) => value.toLowerCase().trim()),

  password: z
    .string({message: 'Senha deve ser um texto'})
    .min(6, {message: 'A Senha deve ter pelo menos 6 caracteres'})
    .max(100, {message: 'Senha muito longa'}),

  acceptTerms: z
    .boolean({message: 'Você deve aceitar os termos de uso'})
    .refine(val => val === true, 'Você deve aceitar os termos de uso'),
});

export type SignUpFormData = z.infer<typeof registerSchema>;
export type SignUpInput = z.input<typeof registerSchema>;

export const firstNameSchema = registerSchema.shape.firstName;
export const lastNameSchema = registerSchema.shape.lastName;
export const phoneSchema = registerSchema.shape.phone;
export const emailSchema = registerSchema.shape.email;
export const passwordSchema = registerSchema.shape.password;
