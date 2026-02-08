// src/sections/home/gallery/GalleryForm.tsx
import { useEffect, useState } from 'react';
import { createLead } from '../../../lib/leads';
import { BUSINESS_ID } from '../../../config/business';
import { useLeadValidation } from '../../../hooks/validateLead';

interface GalleryFormProps {
  selectedLook: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const GalleryForm = ({ selectedLook }: GalleryFormProps) => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone_prefix: '+39',
    phone_number_raw: '',
    request: selectedLook ?? '',
    privacy: false,
  });
  const { errors, touched, handleBlur, isValid, resetValidation } = useLeadValidation();

  // Keep request synced with the selected look from the card
  useEffect(() => {
    setFormData((prev) => ({ ...prev, request: selectedLook ?? '' }));
  }, [selectedLook]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.privacy) return; // must accept privacy
    if (!isValid(formData.name, formData.phone_number_raw)) return;
    setStatus('loading');

    try {
      await createLead({
        business_id: BUSINESS_ID,
        name: formData.name.trim(),
        email: null,
        // keep for backward-compat if a unified phone column exists
        phone:
          (formData.phone_number_raw
            ? `${formData.phone_prefix}${formData.phone_number_raw}`
            : null) || null,
        request: formData.request || null,
        channel: 'website',
        section: 'gallery',
        // if these columns were added:
        phone_prefix: formData.phone_prefix,
        phone_number_raw: formData.phone_number_raw || null,
      });

      setStatus('success');
      setFormData((prev) => ({
        ...prev,
        name: '',
        phone_number_raw: '',
        privacy: false,
        request: selectedLook ?? '',
      }));
      resetValidation();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message ?? 'Errore durante l’invio.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-0">
      <h3 className="text-3xl font-bold mb-6 text-black">Trasforma il tuo desiderio in realtà</h3>

      {/* Nome */}
      <div className="mb-4">
        <label className="block text-black font-medium mb-2">Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={(e) => handleBlur('name', e.target.value)}
          className="w-full border border-[#d9d3cb] px-3 py-3 rounded-none focus:outline-none focus:border-[#3C2A21]"
          placeholder="Il tuo nome"
          required
        />
        {touched.name && errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Numero */}
      <div className="mb-2">
        <label className="block text-black font-medium mb-2">Numero</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="phone_prefix"
            value={formData.phone_prefix}
            onChange={handleChange}
            className="w-24 border border-[#d9d3cb] px-3 py-3 rounded-none bg-[#f6f3ef] text-black focus:outline-none"
            readOnly
          />
          <input
            type="text"
            name="phone_number_raw"
            value={formData.phone_number_raw}
            onChange={handleChange}
            onBlur={(e) => handleBlur('phone_number_raw', e.target.value)}
            className="flex-1 border border-[#d9d3cb] px-3 py-3 rounded-none focus:outline-none focus:border-[#3C2A21]"
            placeholder="Numero di telefono"
          />
        </div>
        {touched.phone_number_raw && errors.phone_number_raw && (
          <p className="text-red-600 text-xs mt-1">{errors.phone_number_raw}</p>
        )}
      </div>

      {/* Look desiderato */}
      <div className="mb-4">
        <label className="block text-black font-medium mb-2">Look desiderato</label>
        <input
          type="text"
          name="request"
          value={formData.request}
          readOnly
          className="w-full border border-[#d9d3cb] px-3 py-3 rounded-none bg-[#f6f3ef] text-black focus:outline-none"
        />
      </div>

      {/* Privacy */}
      <label className="flex items-start gap-2 text-sm text-black mb-4 select-none">
        <input
          type="checkbox"
          name="privacy"
          checked={formData.privacy}
          onChange={handleChange}
          className="mt-1.5 accent-[#3C2A21]"
          required
        />
        <span>
          Ho letto la{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Privacy policy
          </a>{' '}
          e acconsento al trattamento dei dati.
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          status === 'loading' ||
          !formData.name.trim() ||
          !formData.privacy ||
          !isValid(formData.name, formData.phone_number_raw)
        }
        className="w-full bg-[#3C2A21] text-[#E8E0D6] py-3 font-semibold tracking-wide rounded-none transition disabled:opacity-60"
      >
        {status === 'loading' ? 'Invio…' : 'Invia Richiesta'}
      </button>

      {errorMsg && (
        <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
      )}
      {status === 'success' && (
        <p className="mt-3 text-sm text-green-700">
          Richiesta inviata! Ti ricontatteremo a breve.
        </p>
      )}
    </form>
  );
};

export default GalleryForm;
