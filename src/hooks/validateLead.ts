import { useState } from 'react';

interface ValidationErrors {
  name?: string;
  phone_number_raw?: string;
}

export const useLeadValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone_number_raw?: boolean }>({});

  const validateName = (name: string): string | undefined => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return 'Campo obbligatorio';
    }

    if (!/^[a-zA-Z�������������������������������\s'-]+$/.test(trimmedName)) {
      return 'Il nome deve contenere caratteri alfabetici';
    }

    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      return 'Campo obbligatorio';
    }

    if (!/^\d+$/.test(trimmedPhone)) {
      return 'Il numero deve contenere 10 caratteri numerici';
    }

    if (trimmedPhone.length !== 10) {
      return 'Il numero deve contenere 10 caratteri numerici';
    }

    return undefined;
  };

  const handleBlur = (field: 'name' | 'phone_number_raw', value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error: string | undefined;

    if (field === 'name') {
      error = validateName(value);
    } else if (field === 'phone_number_raw') {
      error = validatePhone(value);
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isValid = (name: string, phone: string): boolean => {
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);

    return !nameError && !phoneError;
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    handleBlur,
    isValid,
    resetValidation,
  };
};
