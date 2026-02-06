// src/booking/slots/contact/useContactValidation.ts
import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface ContactValidationErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthdate?: string;
}

export interface ContactData {
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  birthdate: string;
}

export function validateContactData(data: ContactData): ContactValidationErrors {
  const errors: ContactValidationErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "Il nome non può essere vuoto";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "Il nome deve avere almeno 2 caratteri";
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.firstName)) {
    errors.firstName = "Il nome richiede caratteri alfabetici";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Il cognome non può essere vuoto";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Il cognome deve avere almeno 2 caratteri";
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.lastName)) {
    errors.lastName = "Il cognome richiede caratteri alfabetici";
  }

  const rawPhone = data.phoneNumber.trim();
  if (!rawPhone) {
    errors.phoneNumber = "Il numero di telefono non può essere vuoto";
  } else if (!/^\d+$/.test(rawPhone)) {
    errors.phoneNumber = "Il numero di telefono richiede caratteri numerici";
  } else {
    const phoneNumber = parsePhoneNumberFromString(`${data.phonePrefix}${rawPhone}`);
    if (!phoneNumber || !phoneNumber.isValid()) {
      errors.phoneNumber = "Numero di telefono non valido";
    }
  }

  if (data.birthdate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.birthdate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      errors.birthdate = "La data di nascita deve essere nel passato";
    }
  }

  return errors;
}

interface UseContactValidationReturn {
  errors: ContactValidationErrors;
  touchedFields: Set<string>;
  handleBlur: (fieldName: string) => void;
  validateForm: () => boolean;
}

export const useContactValidation = (contactData: ContactData): UseContactValidationReturn => {
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    const validationErrors = validateContactData(contactData);
    setErrors(validationErrors);
  };

  const validateForm = (): boolean => {
    const validationErrors = validateContactData(contactData);
    setErrors(validationErrors);
    setTouchedFields(new Set(['firstName', 'lastName', 'phoneNumber', 'birthdate']));
    return Object.keys(validationErrors).length === 0;
  };

  return {
    errors,
    touchedFields,
    handleBlur,
    validateForm,
  };
};
