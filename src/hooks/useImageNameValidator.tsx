import { useState } from "react";

interface UseImageNameValidatorReturn {
  validateImage: (file: File) => boolean;
  error: string | null;
  clearError: () => void;
}
export const useImageNameValidator = (
  maxText: number = 25
): UseImageNameValidatorReturn => {
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File): boolean => {
    const fileNameWithoutExtension = file.name
      .split(".")
      .slice(0, -1)
      .join(".");
    if (fileNameWithoutExtension.length > maxText) {
      setError(`Image name should not exceed ${maxText} characters.`);
      return false;
    }

    setError(null);
    return true;
  };

  const clearError = () => setError(null);

  return {
    validateImage,
    error,
    clearError,
  };
};
