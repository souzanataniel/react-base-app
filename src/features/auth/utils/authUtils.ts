/**
 * Formata erros do Supabase para mensagens amigáveis
 */
export const formatErrors = (error: any): string => {
  if (error?.message) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Email ou Senha incorretos';
    }
    if (error.message.includes('User already registered')) {
      return 'Este e-mail já está cadastrado';
    }
    if (error.message.includes('Password should be at least 6 characters')) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    if (error.message.includes('Unable to validate email address')) {
      return 'Email inválido';
    }
    return error.message;
  }
  return 'Erro inesperado. Tente novamente.';
};
