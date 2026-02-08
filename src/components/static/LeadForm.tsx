// src/components/static/LeadForm.tsx
import { useState } from 'react';
import { createLead } from '../../lib/leads';
import { BUSINESS_ID } from '../../config/business';
import { useLeadValidation } from '../../hooks/validateLead';

type Status = 'idle' | 'loading' | 'success' | 'error';

const LeadForm = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone_prefix: '+39',
    phone_number_raw: '',
    request: '',
    privacy: false,
  });
  const { errors, touched, handleBlur, isValid, resetValidation } = useLeadValidation();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.privacy) return;
    if (!isValid(form.name, form.phone_number_raw)) return;

    try {
      setStatus('loading');

      await createLead({
        business_id: BUSINESS_ID,
        name: form.name.trim(),
        email: null,
        request: form.request.trim() || null,
        channel: 'website',
        section: null,
        phone_prefix: form.phone_prefix || '+39',
        phone_number_raw: form.phone_number_raw.replace(/\D/g, '') || null,
      });

      setStatus('success');
      setForm({
        name: '',
        phone_prefix: '+39',
        phone_number_raw: '',
        request: '',
        privacy: false,
      });
      resetValidation();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message ?? 'Errore durante l’invio.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-black">
      {/* NAME */}
      <div>
        <input
          name="name"
          placeholder="Nome e cognome"
          value={form.name}
          onChange={onChange}
          onBlur={(e) => handleBlur('name', e.target.value)}
          required
          autoComplete="name"
          className="w-full border border-[#3C2A21] bg-white text-black px-4 py-3 outline-none rounded-none focus:ring-0 focus:border-[#3C2A21]"
        />
        {touched.name && errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* PHONE PREFIX + RAW (same row on all breakpoints) */}
      <div>
        <div className="flex flex-row gap-2">
          <input
            name="phone_prefix"
            value={form.phone_prefix}
            readOnly
            className="w-24 border border-[#3C2A21] bg-white text-black px-4 py-3 outline-none rounded-none focus:ring-0"
          />
          <input
            name="phone_number_raw"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Numero di telefono"
            value={form.phone_number_raw}
            onChange={onChange}
            onBlur={(e) => handleBlur('phone_number_raw', e.target.value)}
            className="flex-1 border border-[#3C2A21] bg-white text-black px-4 py-3 outline-none rounded-none focus:ring-0 focus:border-[#3C2A21]"
          />
        </div>
        {touched.phone_number_raw && errors.phone_number_raw && (
          <p className="text-red-600 text-xs mt-1">{errors.phone_number_raw}</p>
        )}
      </div>

      {/* REQUEST */}
      <textarea
        name="request"
        placeholder="Richiesta (opzionale)"
        value={form.request}
        onChange={onChange}
        rows={4}
        className="w-full border border-[#3C2A21] bg-white text-black px-4 py-3 outline-none rounded-none resize-none focus:ring-0 focus:border-[#3C2A21]"
      />

      {/* PRIVACY */}
      <label className="flex items-start gap-2 text-xs">
        <input
          type="checkbox"
          name="privacy"
          checked={form.privacy}
          onChange={onChange}
          className="mt-0.5 accent-[#3C2A21]"
          required
        />
        <span>
          Ho letto la <a href="/privacy" className="underline">Privacy policy</a> e acconsento al trattamento dei dati.
        </span>
      </label>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={status === 'loading' || !form.privacy || !form.name.trim() || !isValid(form.name, form.phone_number_raw)}
        className="w-full bg-[#3C2A21] text-white py-3 font-semibold tracking-wide rounded-none hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Invio…' : 'INVIA RICHIESTA'}
      </button>

      {errorMsg && <p className="text-[12px] text-red-600">{errorMsg}</p>}
      {status === 'success' && (
        <p className="text-[12px] text-green-700">Richiesta inviata! Ti ricontatteremo a breve.</p>
      )}
    </form>
  );
};

export default LeadForm;
