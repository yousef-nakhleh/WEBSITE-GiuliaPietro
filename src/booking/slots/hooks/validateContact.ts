// src/booking/slots/hooks/validateContact.ts
export interface ContactValidationErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthdate?: string;
}

export function validateContactData(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthdate: string;
}): ContactValidationErrors {
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

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = "Il numero di telefono non può essere vuoto";
  } else if (!/^\d+$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Il numero di telefono richiede caratteri numerici";
  } else if (data.phoneNumber.length !== 10) {
    errors.phoneNumber = "Il numero deve essere di 10 caratteri";
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