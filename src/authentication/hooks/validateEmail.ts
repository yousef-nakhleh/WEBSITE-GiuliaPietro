import { useState, useCallback } from "react";

interface ValidationResult {
  value: string;
  setValue: (email: string) => void;
  error: string | null;
  isValid: boolean;
  validate: () => boolean;
}

export function useEmailValidation(initialValue = ""): ValidationResult {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    let emailToValidate = value.trim();
    setValue(emailToValidate);

    if (emailToValidate === "") {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (emailToValidate.includes(" ")) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (emailToValidate.length > 254) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    const parts = emailToValidate.split("@");
    if (parts.length !== 2) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    const [local, domain] = parts;

    if (!local || !domain) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (!domain.includes(".")) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (local.startsWith(".") || local.endsWith(".")) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (domain.startsWith(".") || domain.endsWith(".")) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    if (emailToValidate.includes("..")) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    const tldIndex = domain.lastIndexOf(".");
    const tld = domain.substring(tldIndex + 1);
    if (tld.length < 2) {
      setError("Email non valida. Ricontrolla l'indirizzo inserito.");
      return false;
    }

    setError(null);
    return true;
  }, [value]);

  const isValid = error === null && value.trim() !== "";

  return {
    value,
    setValue,
    error,
    isValid,
    validate,
  };
}
