import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from './useAuth';
import {registerSchema, SignUpFormData} from '@/features/auth/schemas/registerSchema';

type SubmitResult = {
  success: true;
} | {
  success: false;
  message: string;
};

export const useSignUp = () => {
  const {signUp, isLoading, error, clearError} = useAuth();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      acceptTerms: false
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    formState,
    reset,
    getValues,
    setValue,
    setError,
  } = form;

  const onValid = async (data: SignUpFormData): Promise<SubmitResult> => {
    try {
      const result = await signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (result.success) {
        reset();
        // ✅ SEM NAVEGAÇÃO - AuthGate vai redirecionar automaticamente
        return {success: true};
      }

      if (result.fieldErrors) {
        if (result.fieldErrors.firstName) setError('firstName', {
          type: 'server',
          message: result.fieldErrors.firstName
        });
        if (result.fieldErrors.lastName) setError('lastName', {type: 'server', message: result.fieldErrors.lastName});
        if (result.fieldErrors.email) setError('email', {type: 'server', message: result.fieldErrors.email});
        if (result.fieldErrors.phone) setError('phone', {type: 'server', message: result.fieldErrors.phone});
        if (result.fieldErrors.password) setError('password', {type: 'server', message: result.fieldErrors.password});
      }

      return {
        success: false,
        message: result.error || 'Erro ao criar conta'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Erro inesperado. Tente novamente.'
      };
    }
  };

  const onInvalid = (errors: any): SubmitResult => {
    const msgs = Object.values(errors)
      .map((e: any) => e?.message)
      .filter(Boolean)
      .join('\n');

    return {
      success: false,
      message: msgs || 'Há erros no formulário.'
    };
  };

  const submit = async (): Promise<SubmitResult> => {
    if (Object.keys(formState.errors).length > 0) {
      return onInvalid(formState.errors);
    }

    const currentValues = getValues();
    const validation = registerSchema.safeParse(currentValues);

    if (!validation.success) {
      const validationErrors = validation.error.issues.reduce((acc, err) => {
        const fieldName = err.path[0] as keyof SignUpFormData;
        acc[fieldName] = {message: err.message};
        return acc;
      }, {} as any);

      return onInvalid(validationErrors);
    }

    return await onValid(validation.data);
  };

  // Função para calcular força da senha
  const getPasswordStrength = (): 'weak' | 'medium' | 'strong' => {
    const password = getValues('password') || '';

    if (password.length < 6) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 3) return 'strong';
    if (score >= 1) return 'medium';
    return 'weak';
  };

  const getFieldError = (name: keyof SignUpFormData): string | undefined =>
    (formState.errors?.[name]?.message as string) || undefined;

  const hasFieldError = (name: keyof SignUpFormData): boolean =>
    !!formState.errors?.[name];

  return {
    // Valores dos campos
    firstName: getValues('firstName') || '',
    lastName: getValues('lastName') || '',
    email: getValues('email') || '',
    phone: getValues('phone') || '',
    password: getValues('password') || '',
    acceptTerms: getValues('acceptTerms') || false,

    // Funções de atualização
    updateFirstName: (v: string) => setValue('firstName', v, {shouldDirty: true}),
    updateLastName: (v: string) => setValue('lastName', v, {shouldDirty: true}),
    updateEmail: (v: string) => setValue('email', v, {shouldDirty: true}),
    updatePhone: (v: string) => setValue('phone', v, {shouldDirty: true}),
    updatePassword: (v: string) => setValue('password', v, {shouldDirty: true}),
    updateAcceptTerms: (v: boolean) => setValue('acceptTerms', v, {shouldDirty: true}),

    submit,

    isLoading,
    canSubmit: !isLoading,
    error,
    errors: formState.errors,
    getFieldError,
    hasFieldError,
    clearError,
    getPasswordStrength,

    form,
  };
};
