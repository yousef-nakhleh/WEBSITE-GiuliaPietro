import { useNavigate } from 'react-router-dom';

const CTAs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* CTA Button (same visual language) */}
      <button
        onClick={() => navigate('/prenotazione/servizi')}
        className="px-8 py-3 border-2 border-white bg-white text-[#6e5a49] rounded-full text-sm font-semibold tracking-wider hover:bg-transparent hover:text-white transition-all duration-300"
      >
        SCOPRI I SERVIZI
      </button>
    </div>
  );
};

export default CTAs;