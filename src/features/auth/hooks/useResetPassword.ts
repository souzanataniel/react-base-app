import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {ResetPasswordFormData, resetPasswordSchema} from '@/features/auth/schemas/forgotPasswordSchema';
import {resetPassword, verifyResetToken} from '@/features/auth/services/authService';

type SubmitResult = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
};

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    formState,
    reset,
    getValues,
    setValue,
    setError: setFormError,
  } = form;

  // Verificar token ao montar o componente
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsVerifying(true);
        const {isValid} = await verifyResetToken();

        if (!isValid) {
          setError('Link de reset inválido ou expirado');
          setTimeout(() => {
            router.replace('/(auth)/forgot-password');
          }, 3000);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        setError('Erro ao verificar link de reset');
        setTimeout(() => {
          router.replace('/(auth)/forgot-password');
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    checkToken();
  }, [router]);

  const clearError = () => setError(null);

  const onValid = async (data: ResetPasswordFormData): Promise<SubmitResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await resetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (result.success) {
        reset();

        // Redirecionar para login após sucesso
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);

        return {
          success: true,
          message: result.message || 'Senha atualizada com sucesso!'
        };
      }

      if (result.error) {
        setFormError('password', {
          type: 'server',
          message: result.error
        });
      }

      return {
        success: false,
        message: result.message || result.error || 'Erro ao atualizar senha'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Erro inesperado. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
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
    if (!isValidToken) {
      return {
        success: false,
        message: 'Token inválido ou expirado'
      };
    }

    if (Object.keys(formState.errors).length > 0) {
      return onInvalid(formState.errors);
    }

    const currentValues = getValues();
    const validation = resetPasswordSchema.safeParse(currentValues);

    if (!validation.success) {
      const validationErrors = validation.error.issues.reduce((acc, err) => {
        const fieldName = err.path[0] as keyof ResetPasswordFormData;
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

  const getFieldError = (name: keyof ResetPasswordFormData): string | undefined =>
    (formState.errors?.[name]?.message as string) || undefined;

  const hasFieldError = (name: keyof ResetPasswordFormData): boolean =>
    !!formState.errors?.[name];

  return {
    // Estados
    isVerifying,
    isValidToken,

    // Valores dos campos
    password: getValues('password') || '',
    confirmPassword: getValues('confirmPassword') || '',

    // Funções de atualização
    updatePassword: (v: string) => setValue('password', v, {shouldDirty: true}),
    updateConfirmPassword: (v: string) => setValue('confirmPassword', v, {shouldDirty: true}),

    submit,

    isLoading,
    canSubmit: !isLoading && isValidToken,
    error,
    errors: formState.errors,
    getFieldError,
    hasFieldError,
    clearError,
    getPasswordStrength,

    form,
  };
};
