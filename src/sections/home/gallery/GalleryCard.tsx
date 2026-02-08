// src/sections/home/gallery/GalleryCard.tsx
import { useEffect, useRef, useState } from 'react';

type Props = {
  onSelectLook?: (lookDescription: string) => void;
};

const modelImages = [
  '/assets/images/giulia-e-pietro-balayage-naturale-beige-caravaggio',
  '/assets/images/giulia-e-pietro-balayage-freddo-sabbia-caravaggio',
  '/assets/images/giulia-e-pietro-rame-intenso-luminoso-caravaggio',
  '/assets/images/giulia-e-pietro-castano-caldo-naturale-caravaggio',
  '/assets/images/giulia-e-pietro-balayage-freddo-perlato-caravaggio',
  '/assets/images/giulia-e-pietro-riccio-rame-vibrante-caravaggio',
  '/assets/images/giulia-e-pietro-biondo-freddo-naturale-caravaggio',
  '/assets/images/giulia-e-pietro-nero-profondo-lucido-caravaggio',
  '/assets/images/giulia-e-pietro-biondo-naturale-luminoso-caravaggio',
  '/assets/images/giulia-e-pietro-rame-caldo-multidimensionale-caravaggio',
];

// 🔹 Exact descriptions to pass to the form (no “Look X — …” labels)
const lookDescriptions = [
  'Balayage freddo sabbia, con sfumature soft e luminosità naturale su lunghezze ondulate.',
  'Balayage naturale beige, con sfumature delicate e onde morbide armoniose.',
  'Rame intenso e luminoso, con riflessi caldi e onde morbide naturali.',
  'Nero profondo e lucido, con onde morbide che esaltano eleganza e intensità del colore.',
  'Balayage freddo con sfumature perlate e finish luminoso naturale.',
  'Riccio rame vibrante, con definizione naturale e riflessi caldi luminosi.',
  'Biondo freddo naturale, con schiariture pulite e finish setoso sulle lunghezze.',
  'Castano caldo naturale, con riflessi morbidi e movimento elegante sulle lunghezze.',
  'Biondo naturale luminoso, con schiariture morbide e movimento leggero.',
  'Rame caldo multidimensionale, con riflessi avvolgenti e texture morbida naturale.',
];

const AUTO_MS = 2500;
const RESUME_AFTER_MS = 5000;

const GalleryCard = ({ onSelectLook }: Props) => {
  const [index, setIndex] = useState(0);

  // timers
  const autoTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);

  // touch handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // focusable wrapper ref (for keyboard)
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const next = () => setIndex((i) => (i + 1) % modelImages.length);
  const prev = () => setIndex((i) => (i - 1 + modelImages.length) % modelImages.length);

  const startAuto = () => {
    stopAuto();
    autoTimer.current = window.setInterval(next, AUTO_MS);
  };

  const stopAuto = () => {
    if (autoTimer.current) {
      window.clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  };

  const pauseAndResume = () => {
    stopAuto();
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    resumeTimer.current = window.setTimeout(() => {
      startAuto();
    }, RESUME_AFTER_MS);
  };

  // init / cleanup
  useEffect(() => {
    startAuto();
    return () => {
      stopAuto();
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keyboard support when focused
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const containsFocus =
        wrapperRef.current &&
        active &&
        (active === wrapperRef.current || wrapperRef.current.contains(active as Node));

      if (!containsFocus) return;

      if (e.key === 'ArrowRight') {
        next();
        pauseAndResume();
      } else if (e.key === 'ArrowLeft') {
        prev();
        pauseAndResume();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dx = touchEndX.current - touchStartX.current;
    const threshold = 40; // swipe sensitivity
    if (dx > threshold) {
      prev();
      pauseAndResume();
    } else if (dx < -threshold) {
      next();
      pauseAndResume();
    }
  };

  const handleSelect = () => {
    const desc = lookDescriptions[index] ?? lookDescriptions[0];
    onSelectLook?.(desc);

    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          const y = form.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="flex justify-end">
      <div
        ref={wrapperRef}
        className="relative w-full max-w-md overflow-hidden shadow-xl outline-none"
        style={{ borderRadius: 0 }}
        tabIndex={0}
        role="group"
        aria-label="Galleria look"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 🔒 Fixed vertical frame (no size jumps) */}
        <div className="w-full aspect-[3/4]">
          <picture>
            <source
              srcSet={`${modelImages[index]}.webp`}
              type="image/webp"
            />
            <source
              srcSet={`${modelImages[index]}.png`}
              type="image/png"
            />
            <img
              src={`${modelImages[index]}.png`}
              alt={lookDescriptions[index] ?? `Look ${index + 1}`}
              loading="lazy"
              decoding="async"
              width={600}
              height={800}
              className="h-full w-full object-cover select-none"
              draggable={false}
            />
          </picture>
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          aria-label="Precedente"
          onClick={() => {
            prev();
            pauseAndResume();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-[#6e5a49]/85 text-white hover:bg-[#6e5a49] transition focus:outline-none"
          style={{ borderRadius: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          aria-label="Successivo"
          onClick={() => {
            next();
            pauseAndResume();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-[#6e5a49]/85 text-white hover:bg-[#6e5a49] transition focus:outline-none"
          style={{ borderRadius: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* BOTTOM CTA */}
        <button
          type="button"
          onClick={handleSelect}
          className="absolute bottom-0 left-0 w-full text-black text-center py-4 tracking-wide"
          style={{ backgroundColor: '#e8dfd5', borderRadius: 0 }}
        >
          VOGLIO QUESTO LOOK
        </button>
      </div>
    </div>
  );
};

export default GalleryCard;
