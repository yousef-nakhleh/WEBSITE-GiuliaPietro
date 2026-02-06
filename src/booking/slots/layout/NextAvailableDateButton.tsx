// src/booking/slots/layout/NextAvailableDateButton.tsx
import { Calendar, ArrowRight } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useNextAvailableDate } from '../hooks/useNextAvailableDate';

interface NextAvailableDateButtonProps {
  supabaseClient: SupabaseClient;
  edgeFunctionName: string;
  businessId: string;
  currentDate: Date;
  setDate: (date: Date) => void;
  serviceIds: string[];
  barberId: string | null;
  maxDaysToCheck?: number;
  className?: string;
}

export const NextAvailableDateButton = ({
  supabaseClient,
  edgeFunctionName,
  businessId,
  currentDate,
  setDate,
  serviceIds,
  barberId,
  maxDaysToCheck = 30,
  className = '',
}: NextAvailableDateButtonProps) => {
  const { findNextAvailable, loading } = useNextAvailableDate({
    supabaseClient,
    businessId,
    barberId,
    serviceIds,
    currentDate,
    maxDaysToCheck,
    edgeFunctionName,
  });

  const handleClick = async () => {
    const nextDate = await findNextAvailable();
    
    if (nextDate) {
      setDate(nextDate);
    } else {
      alert(
        `Nessuna disponibilità trovata nei prossimi ${maxDaysToCheck} giorni. Ti consigliamo di contattare il salone direttamente.`
      );
    }
  };

  return (
    <div className={className || "text-center"}>
      <button
        onClick={handleClick}
        disabled={loading}
        className="group bg-[#E8E0D5] border border-black text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-heading font-bold text-sm sm:text-base transition-all duration-300 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2 sm:gap-3 mx-auto"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            <span>Ricerca in corso...</span>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Trova il prossimo giorno disponibile</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};
