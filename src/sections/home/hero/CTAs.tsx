// src/sections/home/hero/CTAs.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../../../components/static/LeadForm';

const CTAs = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // lock/unlock page scroll
  useEffect(() => {
    document.body.style.overflow = isFormOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen]);

  // focus dialog & close on ESC
  useEffect(() => {
    if (!isFormOpen) return;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFormOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFormOpen]);

  return (
    <>
      <div className="flex justify-center gap-4">
        <div className="relative inline-flex items-center justify-center min-w-[150px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div
              className="absolute inset-[-100%] animate-border-spin"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, transparent 60%, #e8dfd5 75%, #3C2A21 85%, #e8dfd5 95%, transparent 100%)',
              }}
            />
          </div>
          <button
            onClick={() => navigate('/prenotazione/servizi')}
            className="relative bg-white text-[#3C2A21] m-[2px] px-8 py-3 rounded-3xl font-semibold text-sm tracking-wider text-center leading-none flex items-center justify-center w-full"
          >
            PRENOTA ORA
          </button>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-transparent border border-[#e8dfd5] text-[#e8dfd5] px-8 py-3 rounded-full font-semibold text-sm tracking-wider text-center leading-none flex items-center justify-center min-w-[150px] hover:bg-[#e8dfd5] hover:text-[#3C2A21] transition-all duration-300"
        >
          CONSULENZA GRATUITA
        </button>
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overscroll-contain"
          aria-modal="true"
          role="dialog"
          aria-labelledby="consult-title"
          onClick={() => setIsFormOpen(false)}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* dialog */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-10 w-[92vw] max-w-[980px] max-h-[92vh] md:max-h-[85vh] h-auto rounded-none shadow-2xl bg-white overflow-auto md:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* mobile: form only; desktop: image + form */}
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] h-full">
              {/* LEFT: image (hidden on mobile) */}
              <div className="hidden md:block h-full">
                <img
                  src="/assets/model12.png"
                  alt="Modella"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* RIGHT: form */}
              <div className="relative h-full bg-[#ece3d8] bg-opacity-90 px-6 md:px-8 py-6 flex flex-col">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 h-8 w-8 leading-none text-[#3C2A21]"
                  aria-label="Chiudi"
                >
                  ✕
                </button>

                <h2
                  id="consult-title"
                  className="text-3xl font-extrabold tracking-tight text-[#3C2A21] mb-2"
                >
                  CONSULENZA GRATUITA
                </h2>
                <p className="text-[15px] leading-relaxed text-[#3C2A21] mb-4">
                  Lascia i tuoi dati: ti ricontattiamo per una consulenza personalizzata.
                </p>

                <div className="min-h-0 overflow-y-auto">
                  <LeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTAs;