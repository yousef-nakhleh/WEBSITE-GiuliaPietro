// src/booking/staff/useStaff.ts
import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { bookingStorage } from '../../utils/bookingStorage';

export interface Staff {
  id: string;
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface UseStaffOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  onStaffSelect?: (staff: Staff) => void;
}

interface UseStaffReturn {
  staff: Staff[];
  loading: boolean;
  error: string | null;
  selectStaff: (staff: Staff) => void;
}

export const useStaff = ({
  supabaseClient,
  businessId,
  onStaffSelect,
}: UseStaffOptions): UseStaffReturn => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from('barbers')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'active');

      if (fetchError) {
        setError(fetchError.message);
        setStaff([]);
      } else if (data) {
        setStaff(data as Staff[]);
      }

      setLoading(false);
    };

    fetchStaff();
  }, [supabaseClient, businessId]);

  // Handle staff selection
  const selectStaff = (staff: Staff) => {
    bookingStorage.setItem('selectedBarber', JSON.stringify(staff));

    requestAnimationFrame(() => {
      const verified = bookingStorage.getItem('selectedBarber');
      if (verified && onStaffSelect) {
        onStaffSelect(staff);
      } else if (!verified) {
        console.error('Storage verification failed for barber selection');
        setTimeout(() => {
          if (onStaffSelect) {
            onStaffSelect(staff);
          }
        }, 100);
      }
    });
  };

  return {
    staff,
    loading,
    error,
    selectStaff,
  };
};