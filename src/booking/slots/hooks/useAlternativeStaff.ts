// src/booking/slots/hooks/useAlternativeStaff.ts
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Staff {
  id: string;
  name: string;
}

interface UseAlternativeStaffOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  currentStaffId: string;
  currentDate: Date;
  serviceIds: string[];
  edgeFunctionName: string;
}

interface UseAlternativeStaffReturn {
  alternativeStaff: Staff | null;
  loading: boolean;
}

export const useAlternativeStaff = ({
  supabaseClient,
  businessId,
  currentStaffId,
  currentDate,
  serviceIds,
  edgeFunctionName,
}: UseAlternativeStaffOptions): UseAlternativeStaffReturn => {
  const [loading, setLoading] = useState(true);
  const [alternativeStaff, setAlternativeStaff] = useState<Staff | null>(null);

  useEffect(() => {
    const checkAlternatives = async () => {
      setLoading(true);

      try {
        if (serviceIds.length === 0) {
          setAlternativeStaff(null);
          setLoading(false);
          return;
        }

        // Fetch other active staff
        const { data: staff, error: staffError } = await supabaseClient
          .from('barbers')
          .select('id, name')
          .eq('business_id', businessId)
          .eq('status', 'active')
          .neq('id', currentStaffId);

        if (staffError || !staff || staff.length === 0) {
          setAlternativeStaff(null);
          setLoading(false);
          return;
        }

        const { data: sessionData } = await supabaseClient.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        // Check each staff member for availability
        for (const member of staff) {
          try {
            const { data, error } = await supabaseClient.functions.invoke(edgeFunctionName, {
              body: {
                business_id: businessId,
                barber_id: member.id,
                requested_date: dateStr,
                service_ids: serviceIds,
              },
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
            });

            if (error) {
              console.error(`Error checking availability for staff ${member.id}:`, error);
              continue;
            }

            const perfect = Array.isArray(data?.perfect) ? data.perfect : [];
            const other = Array.isArray(data?.other) ? data.other : [];
            const hasSlots = perfect.length > 0 || other.length > 0;

            if (hasSlots) {
              setAlternativeStaff(member as Staff);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error(`Failed to check availability for staff ${member.id}:`, err);
            continue;
          }
        }

        setAlternativeStaff(null);
      } catch (error) {
        console.error('Error in checkAlternatives:', error);
        setAlternativeStaff(null);
      } finally {
        setLoading(false);
      }
    };

    checkAlternatives();
  }, [supabaseClient, currentDate, serviceIds, currentStaffId, businessId, edgeFunctionName]);

  return {
    alternativeStaff,
    loading,
  };
};
