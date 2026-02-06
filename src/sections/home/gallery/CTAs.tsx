import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const CTAs = () => {
  const navigate = useNavigate();

  // inject CSS once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .cta-diagonal {
        position: relative;
        overflow: hidden;
        background: #6e5a49; /* base brown */
        color: #fff;
        transition: color 0.3s ease;
      }
      .cta-diagonal span {
        position: relative;
        z-index: 2;
      }
      .cta-diagonal::before {
        content: "";
        position: absolute;
        inset: 0;
        width: 0%;
        background: #6e5a49; /* soft brown */
        transform: skew(-20deg);
        transform-origin: left;
        transition: width 0.45s ease;
        z-index: 1;
      }
      .cta-diagonal:hover::before {
        width: 120%;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
      {/* PRENOTA ORA — solid brown, white text, diagonal soft hover */}
      <button
        onClick={() => navigate('/prenotazione/servizi')}
        className="cta-diagonal inline-flex h-14 min-w-[220px] items-center justify-center rounded-full px-8 text-base font-extrabold uppercase tracking-widest"
      >
        <span>Prenota Ora</span>
      </button>

      {/* INSTAGRAM — outline -> fill on hover */}
      <a
        href="https://www.instagram.com/edg.hairstylist/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-14 min-w-[220px] items-center justify-center rounded-full border-2 border-[#6e5a49] px-8 text-base font-extrabold uppercase tracking-widest text-[#6e5a49] transition-colors duration-300 hover:bg-[#6e5a49] hover:text-white"
      >
        Instagram
      </a>
    </div>
  );
};

export default CTAs;