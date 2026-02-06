// src/booking/slots/hooks/useNextAvailableDate.ts
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';

interface UseNextAvailableDateOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  barberId: string | null;
  serviceIds: string[];
  currentDate: Date;
  maxDaysToCheck?: number;
  edgeFunctionName: string;
}

interface UseNextAvailableDateReturn {
  findNextAvailable: () => Promise<Date | null>;
  loading: boolean;
}

export const useNextAvailableDate = ({
  supabaseClient,
  businessId,
  barberId,
  serviceIds,
  currentDate,
  maxDaysToCheck = 30,
  edgeFunctionName,
}: UseNextAvailableDateOptions): UseNextAvailableDateReturn => {
  const [loading, setLoading] = useState(false);

  const findNextAvailable = async (): Promise<Date | null> => {
    if (!barberId || serviceIds.length === 0) return null;

    setLoading(true);

    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;

      for (let i = 1; i <= maxDaysToCheck; i++) {
        const dateToCheck = addDays(currentDate, i);
        const dateStr = format(dateToCheck, 'yyyy-MM-dd');

        try {
          const { data, error } = await supabaseClient.functions.invoke(edgeFunctionName, {
            body: {
              business_id: businessId,
              barber_id: barberId,
              requested_date: dateStr,
              service_ids: serviceIds,
            },
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          });

          if (error) {
            console.error(`Error checking availability for ${dateStr}:`, error);
            continue;
          }

          const perfect = Array.isArray(data?.perfect) ? data.perfect : [];
          const other = Array.isArray(data?.other) ? data.other : [];
          const hasSlots = perfect.length > 0 || other.length > 0;

          if (hasSlots) {
            setLoading(false);
            return dateToCheck;
          }
        } catch (err) {
          console.error(`Failed to check availability for ${dateStr}:`, err);
          continue;
        }
      }

      // No availability found
      setLoading(false);
      return null;
    } catch (error) {
      console.error('Error in findNextAvailable:', error);
      setLoading(false);
      return null;
    }
  };

  return {
    findNextAvailable,
    loading,
  };
};
