import { useEffect, useState } from 'react';

const DiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const alpha = 0.92; // trasparenza regolabile

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    const handleScroll = () => {
      if (window.scrollY > 100) setHasScrolled(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible || hasScrolled) return null;

  return (
    <>
      <style>{`
        @keyframes edg-bottom-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(100%); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .edg-bottom-banner {
          position: fixed;
          left: 50%;
          bottom: 2rem;
          transform: translateX(-50%) translateY(0);
          animation: edg-bottom-in 550ms cubic-bezier(.22,.61,.36,1) both;
          z-index: 50;
        }
      `}</style>

      <div className="edg-bottom-banner" style={{ fontFamily: 'inherit' }}>
        <div
          className="px-8 py-5 rounded-none shadow-2xl border-2 text-black"
          style={{
            borderColor: '#CC1802',
            background: `rgba(232, 223, 213, ${alpha})`,
          }}
        >
          <p className="m-0 text-center text-base leading-snug font-semibold">
            <span className="text-[#CC1802] uppercase">SCONTO</span> di benvenuto<br />
            <a
              href="tel:3339347932"
              className="text-[#CC1802] underline underline-offset-2 decoration-2"
            >
              chiamando ora!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default DiscountBanner;
