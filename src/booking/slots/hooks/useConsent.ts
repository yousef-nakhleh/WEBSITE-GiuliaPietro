import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface ConsentState {
  smsConsent: boolean;
  emailMarketingConsent: boolean;
}

interface UseConsentOptions {
  supabaseClient: SupabaseClient;
  contactId: string | null;
  businessId: string;
}

interface UseConsentReturn {
  consentState: ConsentState;
  setConsentState: (state: ConsentState | ((prev: ConsentState) => ConsentState)) => void;
  loading: boolean;
}

export const useConsent = ({
  supabaseClient,
  contactId,
  businessId,
}: UseConsentOptions): UseConsentReturn => {
  const [consentState, setConsentState] = useState<ConsentState>({
    smsConsent: false,
    emailMarketingConsent: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsents = async () => {
      if (!contactId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabaseClient
          .from('contact_consents')
          .select('channel_type, consent_type, consent_status')
          .eq('contact_id', contactId)
          .eq('business_id', businessId)
          .in('channel_type', ['sms', 'email'])
          .in('consent_type', ['transactional', 'marketing']);

        if (!error && data) {
          const newState: ConsentState = {
            smsConsent: false,
            emailMarketingConsent: false,
          };

          data.forEach((consent) => {
            if (consent.channel_type === 'sms' && consent.consent_type === 'transactional') {
              newState.smsConsent = true;
            }
            if (consent.channel_type === 'email' && consent.consent_type === 'marketing') {
              newState.emailMarketingConsent = true;
            }
          });

          setConsentState(newState);
        }
      } catch (err) {
        console.error('Error loading consents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConsents();
  }, [contactId, businessId, supabaseClient]);

  return {
    consentState,
    setConsentState,
    loading,
  };
};
