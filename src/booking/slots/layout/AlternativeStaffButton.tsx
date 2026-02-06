// src/booking/slots/layout/AlternativeStaffButton.tsx
import { Users, ArrowRight } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAlternativeStaff } from '../hooks/useAlternativeStaff';
import { bookingStorage } from '../../../utils/bookingStorage';

interface Staff {
  id: string;
  name: string;
}

interface AlternativeStaffButtonProps {
  supabaseClient: SupabaseClient;
  edgeFunctionName: string;
  businessId: string;
  currentDate: Date;
  serviceIds: string[];
  currentStaffId: string;
  onStaffChange: (staff: Staff) => void;
  className?: string;
}

export const AlternativeStaffButton = ({
  supabaseClient,
  edgeFunctionName,
  businessId,
  currentDate,
  serviceIds,
  currentStaffId,
  onStaffChange,
  className = '',
}: AlternativeStaffButtonProps) => {
  const { alternativeStaff, loading } = useAlternativeStaff({
    supabaseClient,
    businessId,
    currentStaffId,
    currentDate,
    serviceIds,
    edgeFunctionName,
  });

  const handleClick = () => {
    if (alternativeStaff) {
      bookingStorage.setItem('selectedBarber', JSON.stringify(alternativeStaff));
      onStaffChange(alternativeStaff);
    }
  };

  if (loading || !alternativeStaff) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={className || "group bg-emerald-500 border border-black text-white px-6 py-3 rounded-lg font-heading font-bold transition-all duration-300 hover:bg-emerald-600 hover:border-black shadow-lg hover:shadow-xl flex items-center gap-3"}
    >
      <Users className="w-5 h-5" />
      <span>Un altro collaboratore è libero</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};
