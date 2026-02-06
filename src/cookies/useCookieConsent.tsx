// src/hooks/useCookieConsent.ts
import { useState, useEffect, useCallback } from "react";

type Consent = { analytics: boolean };
const STORAGE_KEY = "cookieConsent:v1";
const CHANGE_EVENT = "cookie-consent-changed";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onCustom = () => setConsent(readConsent());
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEY) setConsent(readConsent());
    };
    window.addEventListener(CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const updateConsent = useCallback((newConsent: Consent) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
      } catch {}
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
    setConsent(newConsent);
  }, []);

  const resetConsent = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
    setConsent(null);
  }, []);

  return { consent, updateConsent, resetConsent };
}