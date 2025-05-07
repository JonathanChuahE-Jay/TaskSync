import { useEffect, useState } from 'react'

interface ValidationState {
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

export const usePasswordValidation = (password: string) => {
  const [validations, setValidations] = useState<ValidationState>({
    hasUpperCase: false,
    hasNumber: false,
    hasMinLength: false,
    isValid: false,
  });

  useEffect(() => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    const isValid = hasUpperCase && hasNumber && hasMinLength;

    setValidations({
      hasUpperCase,
      hasNumber,
      hasMinLength,
      isValid,
    });
  }, [password]);

  return validations;
};
