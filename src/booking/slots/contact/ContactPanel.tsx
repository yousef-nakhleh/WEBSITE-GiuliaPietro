// src/booking/slots/contact/ContactPanel.tsx
import { SectionHeader } from '../../UI/SectionHeader';
import { ContactForm } from './ContactForm';
import { useContactValidation, ContactData, ContactValidationErrors } from './useContactValidation';

interface Contact {
  id: string;
  profile_id: string;
  business_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_prefix: string | null;
  phone_number_raw: string | null;
  phone_number_e164: string | null;
  birthdate: string | null;
}

interface ConsentState {
  smsConsent: boolean;
  emailMarketingConsent: boolean;
}

interface ContactPanelProps {
  isLoggedIn: boolean;
  contact: Contact | null;
  user: any;
  contactData: ContactData;
  onContactDataChange: (data: Partial<ContactData>) => void;
  onOpenLogin: () => void;
  consentState?: ConsentState;
  onConsentChange?: (state: ConsentState) => void;
  validation?: {
    errors: ContactValidationErrors;
    touchedFields: Set<string>;
    onBlur: (fieldName: string) => void;
  };
  className?: string;
}

export const ContactPanel = ({
  isLoggedIn,
  contact,
  user,
  contactData,
  onContactDataChange,
  onOpenLogin,
  consentState = { smsConsent: false, emailMarketingConsent: false },
  onConsentChange = () => {},
  validation,
  className = '',
}: ContactPanelProps) => {
  const email = user?.email ?? "";
  const fallbackValidation = useContactValidation(contactData);
  const errors = validation?.errors ?? fallbackValidation.errors;
  const touchedFields = validation?.touchedFields ?? fallbackValidation.touchedFields;
  const handleBlur = validation?.onBlur ?? fallbackValidation.handleBlur;

  return (
    <section className={className || "pb-6"}>
      <div className="container mx-auto px-4 md:px-8 max-w-2xl space-y-8">
        <SectionHeader title="I Tuoi Dati" />

        {!isLoggedIn ? (
          <div className="text-center">
            <p className="text-gray-600 font-primary mb-4">
              Effettua il login per completare la prenotazione con i tuoi dati salvati.
            </p>
            <button
              onClick={onOpenLogin}
              className="bg-black text-white px-6 py-3 rounded-none font-heading font-bold transition hover:bg-opacity-90"
            >
              Login per completare la prenotazione
            </button>
          </div>
        ) : (
          <ContactForm
            contactData={contactData}
            onContactDataChange={onContactDataChange}
            errors={errors}
            touchedFields={touchedFields}
            onBlur={handleBlur}
            email={email}
            consentState={consentState}
            onConsentChange={onConsentChange}
          />
        )}
      </div>
    </section>
  );
};
