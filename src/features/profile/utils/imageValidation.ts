export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImage = (uri: string, maxSizeInMB: number = 5): ImageValidationResult => {
  // Validações básicas
  if (!uri) {
    return {isValid: false, error: 'URI da imagem é obrigatória'};
  }

  // Verificar extensão
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExtension = validExtensions.some(ext =>
    uri.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'Formato de imagem não suportado. Use JPG, PNG ou WebP.'
    };
  }

  return {isValid: true};
};
