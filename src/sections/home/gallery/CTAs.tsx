import { useNavigate } from 'react-router-dom';

const CTAs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
      {/* PRENOTA ORA */}
      <button
        onClick={() => navigate('/prenotazione/servizi')}
        className="inline-flex h-14 min-w-[220px] items-center justify-center rounded-full px-8 text-base font-extrabold uppercase tracking-widest bg-[#e8dfd5] text-black hover:scale-105 transition-all duration-300"
      >
        <span>Prenota Ora</span>
      </button>

      {/* INSTAGRAM — outline -> fill on hover */}
      <a
        href="https://www.instagram.com/giuliaepietroacconciature/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-14 min-w-[220px] items-center justify-center rounded-full border-2 border-[#e8dfd5] px-8 text-base font-extrabold uppercase tracking-widest text-black transition-transform duration-300 hover:scale-105"
      >
        Instagram
      </a>
    </div>
  );
};

export default CTAs;
