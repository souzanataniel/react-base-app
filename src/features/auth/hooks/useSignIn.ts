import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from './useAuth';
import {useRouter} from 'expo-router';
import {loginSchema, SignInFormData} from '@/features/auth/schemas/loginSchema';

type SubmitResult = {
  success: true;
} | {
  success: false;
  message: string;
};

export const useSignIn = () => {
  const {signIn, isLoading, error, clearError} = useAuth();
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email: '', password: ''},
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

  const onValid = async (data: SignInFormData): Promise<SubmitResult> => {
    try {
      const result = await signIn(data);

      if (result.success) {
        reset();
        try {
          router.replace('/(app)/home');
        } catch {
          router.push('/(app)/home');
        }
        return {success: true};
      }

      if (result.fieldErrors) {
        if (result.fieldErrors.email) setError('email', {type: 'server', message: result.fieldErrors.email});
        if (result.fieldErrors.password) setError('password', {type: 'server', message: result.fieldErrors.password});
      }

      return {
        success: false,
        message: result.error || 'Credenciais inválidas'
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
    const validation = loginSchema.safeParse(currentValues);

    if (!validation.success) {
      const validationErrors = validation.error.issues.reduce((acc, err) => {
        const fieldName = err.path[0] as keyof SignInFormData;
        acc[fieldName] = {message: err.message};
        return acc;
      }, {} as any);

      return onInvalid(validationErrors);
    }

    return await onValid(validation.data);
  };

  const getFieldError = (name: keyof SignInFormData): string | undefined =>
    (formState.errors?.[name]?.message as string) || undefined;

  const hasFieldError = (name: keyof SignInFormData): boolean =>
    !!formState.errors?.[name];

  return {
    email: getValues('email') || '',
    password: getValues('password') || '',
    updateEmail: (v: string) => setValue('email', v, {shouldDirty: true}),
    updatePassword: (v: string) => setValue('password', v, {shouldDirty: true}),

    submit,

    isLoading,
    canSubmit: !isLoading,
    error,
    errors: formState.errors,
    getFieldError,
    hasFieldError,
    clearError,

    form,
  };
};
