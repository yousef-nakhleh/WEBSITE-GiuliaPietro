// src/cookies/CookiePreferenceModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "./useCookieConsent";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CookiePreferenceModal({ open, onClose }: Props) {
  const { consent, updateConsent } = useCookieConsent();
  const [analytics, setAnalytics] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Sync local state when modal opens
  useEffect(() => {
    if (open && consent) setAnalytics(!!consent.analytics);
  }, [open, consent]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Initial focus
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    updateConsent({ analytics });
    onClose();
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-pref-title"
        tabIndex={-1}
        onClick={stop}
        className="w-full max-w-2xl rounded-2xl bg-white text-black shadow-2xl border border-neutral-200 focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 id="cookie-pref-title" className="text-lg font-semibold">
              Preferenze cookie
            </h2>
            <p className="text-sm text-neutral-600">
              Scegli quali cookie possiamo utilizzare. Puoi cambiare scelta in qualsiasi momento.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Necessary */}
          <div className="flex items-start gap-4">
            <div className="h-5 w-5 rounded-md bg-neutral-200 flex items-center justify-center text-xs select-none">
              ✓
            </div>
            <div>
              <div className="font-medium">Necessari</div>
              <div className="text-sm text-neutral-600">
                Richiesti per il corretto funzionamento del sito (sicurezza, sessione). Sempre attivi.
              </div>
            </div>
          </div>

          {/* Analytics */}
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-neutral-300"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <div>
              <div className="font-medium">Analitici</div>
              <div className="text-sm text-neutral-600">
                Ci aiutano a capire l’utilizzo del sito (Google Analytics 4 / Hotjar). Disattivati fino al tuo consenso.
              </div>
            </div>
          </label>
        </div>

        {/* Footer actions (ONLY Cancel + Save) */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-neutral-800"
          >
            Salva preferenze
          </button>
        </div>
      </div>
    </div>
  );
}