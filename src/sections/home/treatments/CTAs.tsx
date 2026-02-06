// src/sections/home/hero/CTAs.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import LeadForm from '../../../components/static/LeadForm';

const CTAs = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Instagram embed loader for the video modal
  useEffect(() => {
    if (!isVideoOpen) return;
    if (!document.getElementById('ig-embed-script')) {
      const s = document.createElement('script');
      s.id = 'ig-embed-script';
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    } else {
      // @ts-ignore
      window.instgrm?.Embeds?.process();
    }
  }, [isVideoOpen]);

  return (
    <>
      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigate('/prenotazione/servizi')}
          className="bg-[#6e5a49] text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wider inline-flex items-center justify-center min-w-[180px] hover:bg-[#5A3A2B] transition-all duration-300"
        >
          Prenota Ora
        </button>

        <button
          onClick={() => setIsFormOpen(true)}
          className="border-2 border-[#6e5a49] text-[#6e5a49] px-8 py-3 rounded-full font-semibold text-sm tracking-wider inline-flex items-center justify-center min-w-[180px] hover:bg-[#6e5a49] hover:text-white transition-all duration-300"
        >
          Consulenza Gratuita
        </button>
      </div>

      {/* FORM MODAL */}
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
            {/* On mobile: only form (column). On desktop: image + form (40/60). */}
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] h-full">
              {/* LEFT: image (desktop only) */}
              <div className="hidden md:block h-full">
                <img
                  src="/assets/model12.png"
                  alt="Modella"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* RIGHT: form panel */}
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

                {/* Scrollable area so the submit button is always reachable on small screens */}
                <div className="min-h-0 overflow-y-auto">
                  <LeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          />

          <div className="relative bg-white rounded-lg shadow-2xl max-w-[480px] w-full max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
              aria-label="Chiudi video"
            >
              <X size={24} className="text-[#3C2A21]" />
            </button>

            <div className="aspect-video w-full">
              <blockquote
                className="instagram-media w-full"
                data-instgrm-permalink="https://www.instagram.com/giuliaepietroacconciature/"
                data-instgrm-version="14"
                style={{ margin: '0 auto', width: '100%', maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTAs;
