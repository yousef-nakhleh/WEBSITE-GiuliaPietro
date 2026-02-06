// src/booking/slots/hooks/useSlots.ts
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';

interface UseSlotsOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  barberId: string | null;
  serviceIds: string[];
  date: Date;
  businessTimezone: string;
  edgeFunctionName: string;
  minuteTick: number;
}

interface Slot {
  label: string;
  value: string;
}

interface UseSlotsReturn {
  perfectSlots: Slot[];
  otherSlots: Slot[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSlots = ({
  supabaseClient,
  businessId,
  barberId,
  serviceIds,
  date,
  businessTimezone,
  edgeFunctionName,
  minuteTick,
}: UseSlotsOptions): UseSlotsReturn => {
  const [perfectSlots, setPerfectSlots] = useState<Slot[]>([]);
  const [otherSlots, setOtherSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = async () => {
    if (!barberId || serviceIds.length === 0) {
      setPerfectSlots([]);
      setOtherSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');

      const { data: sessionData } = await supabaseClient.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;

      const { data, error: fetchError } = await supabaseClient.functions.invoke(edgeFunctionName, {
        body: {
          business_id: businessId,
          barber_id: barberId,
          requested_date: dateStr,
          service_ids: serviceIds,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (fetchError) {
        console.error('Edge function error:', fetchError);
        setError(fetchError.message);
        setPerfectSlots([]);
        setOtherSlots([]);
        return;
      }

      const perfect = Array.isArray(data?.perfect) ? data.perfect : [];
      const other = Array.isArray(data?.other) ? data.other : [];

      setPerfectSlots(perfect);
      setOtherSlots(other);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setError('Errore nel caricamento degli orari');
      setPerfectSlots([]);
      setOtherSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseClient, date, barberId, serviceIds, businessTimezone, minuteTick, edgeFunctionName]);

  return {
    perfectSlots,
    otherSlots,
    loading,
    error,
    refetch: loadSlots,
  };
};  
