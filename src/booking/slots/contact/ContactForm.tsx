// src/booking/slots/contact/ContactForm.tsx
import { ContactData, ContactValidationErrors } from './useContactValidation';

interface ConsentState {
  smsConsent: boolean;
  emailMarketingConsent: boolean;
}

interface ContactFormProps {
  contactData: ContactData;
  onContactDataChange: (data: Partial<ContactData>) => void;
  errors: ContactValidationErrors;
  touchedFields: Set<string>;
  onBlur: (fieldName: string) => void;
  email: string;
  consentState: ConsentState;
  onConsentChange: (state: ConsentState) => void;
  className?: string;
}

export const ContactForm = ({
  contactData,
  onContactDataChange,
  errors,
  touchedFields,
  onBlur,
  email,
  consentState,
  onConsentChange,
  className = '',
}: ContactFormProps) => {
  return (
    <div className={className || "max-w-xl mx-auto"}>
      <div className="bg-gray-50 rounded-none border-2 border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-4">
          Sei collegato con <span className="font-semibold text-black">{email}</span>
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading font-semibold text-black mb-2">
                Nome
              </label>
              <input
                type="text"
                value={contactData.firstName}
                onChange={(e) =>
                  onContactDataChange({ firstName: e.target.value })
                }
                onBlur={() => onBlur("firstName")}
                placeholder="Inserisci il tuo nome"
                className="w-full p-3 border-2 border-gray-300 rounded-none font-primary text-black placeholder-gray-400 focus:border-[#E8E0D5] focus:outline-none transition-colors"
              />
              {touchedFields.has("firstName") && errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-black mb-2">
                Cognome
              </label>
              <input
                type="text"
                value={contactData.lastName}
                onChange={(e) =>
                  onContactDataChange({ lastName: e.target.value })
                }
                onBlur={() => onBlur("lastName")}
                placeholder="Inserisci il tuo cognome"
                className="w-full p-3 border-2 border-gray-300 rounded-none font-primary text-black placeholder-gray-400 focus:border-[#E8E0D5] focus:outline-none transition-colors"
              />
              {touchedFields.has("lastName") && errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-semibold text-black mb-2">
              Telefono
            </label>
            <div className="flex gap-2">
              <select
                value={contactData.phonePrefix}
                onChange={(e) =>
                  onContactDataChange({ phonePrefix: e.target.value })
                }
                className="w-24 p-3 border-2 border-gray-300 rounded-none font-primary text-black focus:border-[#E8E0D5] focus:outline-none transition-colors"
              >
                <option value="+39">+39</option>
                <option value="+41">+41</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
                <option value="+44">+44</option>
                <option value="+1">+1</option>
              </select>
              <input
                type="tel"
                value={contactData.phoneNumber}
                onChange={(e) =>
                  onContactDataChange({ phoneNumber: e.target.value })
                }
                onBlur={() => onBlur("phoneNumber")}
                placeholder="Numero di telefono"
                className="flex-1 p-3 border-2 border-gray-300 rounded-none font-primary text-black placeholder-gray-400 focus:border-[#E8E0D5] focus:outline-none transition-colors"
              />
            </div>
            {touchedFields.has("phoneNumber") && errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-heading font-semibold text-black mb-2">
              Data di Nascita <span className="text-gray-400 font-normal">(opzionale)</span>
            </label>
            <input
              type="date"
              value={contactData.birthdate}
              onChange={(e) =>
                onContactDataChange({ birthdate: e.target.value })
              }
              onBlur={() => onBlur("birthdate")}
              className="w-full p-3 border-2 border-gray-300 rounded-none font-primary text-black placeholder-gray-400 focus:border-[#E8E0D5] focus:outline-none transition-colors"
            />
            {touchedFields.has("birthdate") && errors.birthdate && (
              <p className="text-red-600 text-sm mt-1">{errors.birthdate}</p>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() =>
                  onConsentChange({
                    ...consentState,
                    smsConsent: !consentState.smsConsent,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8E0D5] flex-shrink-0 ${
                  consentState.smsConsent ? 'bg-black' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={consentState.smsConsent}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    consentState.smsConsent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm font-primary text-gray-700 cursor-pointer flex-1" onClick={() =>
                  onConsentChange({
                    ...consentState,
                    smsConsent: !consentState.smsConsent,
                  })
                }>
                Accetto di ricevere SMS relativi all'appuntamento e alla mia esperienza in salone.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() =>
                  onConsentChange({
                    ...consentState,
                    emailMarketingConsent: !consentState.emailMarketingConsent,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8E0D5] flex-shrink-0 ${
                  consentState.emailMarketingConsent ? 'bg-black' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={consentState.emailMarketingConsent}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    consentState.emailMarketingConsent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm font-primary text-gray-700 cursor-pointer flex-1" onClick={() =>
                  onConsentChange({
                    ...consentState,
                    emailMarketingConsent: !consentState.emailMarketingConsent,
                  })
                }>
                Accetto di ricevere email di marketing e promozioni.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
