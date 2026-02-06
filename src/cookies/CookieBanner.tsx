// src/cookies/CookieBanner.tsx
import React, { useState } from "react";
import { useCookieConsent } from "./useCookieConsent";
import CookiePreferenceModal from "./CookiePreferenceModal";

export default function CookieBanner() {
  const { consent, updateConsent } = useCookieConsent();
  const [openPrefs, setOpenPrefs] = useState(false);

  // Show only if no decision yet
  if (consent !== null) return null;

  const acceptAll = () => updateConsent({ analytics: true });
  const rejectAll = () => updateConsent({ analytics: false });

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Banner consenso cookie"
        className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 w-[95%] max-w-[720px]
                   rounded-2xl border bg-[#E5DDD3] text-[#111] border-[#D8D0C6] shadow-2xl"
      >
        <div className="p-5 sm:p-6">
          <p className="text-sm leading-relaxed">
            Utilizziamo i cookie per migliorare l’esperienza di navigazione, fornire contenuti
            personalizzati e analizzare il traffico. Cliccando “Accetta tutto” acconsenti
            all’uso dei cookie.
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={rejectAll}
              className="inline-flex items-center justify-center rounded-full border border-[#111] px-6 py-2 text-sm font-medium
                         hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Rifiuta tutto
            </button>

            <button
              onClick={() => setOpenPrefs(true)}
              className="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium
                         hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Preferenze
            </button>

            <button
              onClick={acceptAll}
              className="inline-flex items-center justify-center rounded-full bg-[#111] text-white px-6 py-2 text-sm font-semibold
                         hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              Accetta tutto
            </button>
          </div>
        </div>
      </div>

      <CookiePreferenceModal open={openPrefs} onClose={() => setOpenPrefs(false)} />
    </>
  );
}