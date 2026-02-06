// src/booking/slots/logic/slotVerification.ts
import type { SupabaseClient } from '@supabase/supabase-js';

interface VerifySlotOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  barberId: string;
  dateStr: string;
  serviceIds: string[];
  timeHHmm: string;
  edgeFunctionName: string;
}

/**
 * Verifies if a specific time slot is still available via Edge Function
 * @returns true if slot exists in perfect or other slots, false otherwise
 */
export const verifySlotViaEdgeFunction = async ({
  supabaseClient,
  businessId,
  barberId,
  dateStr,
  serviceIds,
  timeHHmm,
  edgeFunctionName,
}: VerifySlotOptions): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;

    const { data, error } = await supabaseClient.functions.invoke(edgeFunctionName, {
      body: {
        business_id: businessId,
        barber_id: barberId,
        requested_date: dateStr,
        service_ids: serviceIds,
        requested_time: timeHHmm,
      },
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    if (error) {
      console.error('Slot verification error:', error);
      return false;
    }

    const perfect: Array<{ value: string }> = Array.isArray(data?.perfect) ? data.perfect : [];
    const other: Array<{ value: string }> = Array.isArray(data?.other) ? data.other : [];
    
    const exists =
      perfect.some(s => s.value === timeHHmm) ||
      other.some(s => s.value === timeHHmm);

    return exists;
  } catch (err) {
    console.error('Failed to verify slot:', err);
    return false;
  }
};
