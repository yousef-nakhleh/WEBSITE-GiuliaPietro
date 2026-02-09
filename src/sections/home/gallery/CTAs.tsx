import { useNavigate } from 'react-router-dom';

const CTAs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      {/* PRENOTA ORA */}
      <button
        onClick={() => navigate('/prenotazione/servizi')}
        className="inline-flex min-w-[150px] items-center justify-center rounded-3xl px-8 py-3 font-semibold text-sm tracking-wider bg-[#e8dfd5] text-black hover:scale-105 transition-all duration-300"
      >
        <span>PRENOTA ORA</span>
      </button>

      {/* INSTAGRAM */}
      <a
        href="https://www.instagram.com/giuliaepietroacconciature/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-w-[150px] items-center justify-center rounded-3xl border-2 border-[#e8dfd5] px-8 py-3 font-semibold text-sm tracking-wider text-black hover:scale-105 transition-all duration-300"
      >
        INSTAGRAM
      </a>
    </div>
  );
};

export default CTAs;
