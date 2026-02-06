// src/analytics/AnalyticsLoader.tsx
import { useEffect, useRef } from "react";
import { useCookieConsent } from "./useCookieConsent";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = "G-YK0TV1GHMJ";

function injectScriptOnce(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export default function AnalyticsLoader() {
  const { consent } = useCookieConsent();
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (!GA_ID || consent == null) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer!.push(arguments);
      };

    // Default deny
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
    });

    if (consent.analytics) {
      // Update consent and inject
      window.gtag("consent", "update", { analytics_storage: "granted" });

      if (!scriptInjected.current) {
        injectScriptOnce(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
        scriptInjected.current = true;
      }

      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { allow_google_signals: false });
    } else {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }, [consent]);

  return null;
}