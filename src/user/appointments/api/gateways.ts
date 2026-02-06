import type { SupabaseClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { DateTime } from 'luxon';
import type { Appointment, Slot } from '../types';

export interface AppointmentsGateway {
  getAppointments: (userId: string, businessId: string) => Promise<{ data: Appointment[] | null; error: unknown }>;
  updateAppointmentDate: (
    appointmentId: string,
    newAppointmentISO: string,
    updatedBy?: string
  ) => Promise<{ data: Appointment | null; error: unknown }>;
  cancelAppointment: (
    appointmentId: string,
    cancelledBy?: string
  ) => Promise<{ data: Appointment | null; error: unknown }>;
}

export interface TimezoneGateway {
  getBusinessTimezone: (businessId: string) => Promise<{ timezone: string | null; error: unknown }>;
}

export interface SlotsGateway {
  fetchSlots: (params: {
    businessId: string;
    barberId: string;
    serviceId: string;
    date: Date;
  }) => Promise<{ perfect: Slot[]; other: Slot[]; error: unknown }>;
  verifySlot: (params: {
    businessId: string;
    barberId: string;
    serviceId: string;
    timezone: string;
    selectedISO: string;
  }) => Promise<boolean>;
}

const BASE_SELECT =
  'id,business_id,barber_id,profile_id,appointment_date,appointment_status,duration_min,appointment_services(id,service_id,duration_minutes,notes,services(name)),barbers(name)';

export function createSupabaseAppointmentsGateway(
  supabaseClient: SupabaseClient,
  config?: {
    updateAppointmentRpcName?: string;
    cancelAppointmentRpcName?: string;
  }
): AppointmentsGateway {
  const updateRpcName = config?.updateAppointmentRpcName ?? 'update_appointment';
  const cancelRpcName = config?.cancelAppointmentRpcName ?? 'cancel_appointment';

  return {
    async getAppointments(userId, businessId) {
      const { data, error } = await supabaseClient
        .from('appointments')
        .select(BASE_SELECT)
        .eq('profile_id', userId)
        .eq('business_id', businessId)
        .order('appointment_date', { ascending: true });

      return { data: (data as Appointment[] | null) ?? null, error };
    },

    async updateAppointmentDate(appointmentId, newAppointmentISO, updatedBy) {
      void updatedBy;
      const { error: rpcError } = await supabaseClient.rpc(updateRpcName, {
        p_appointment_id: appointmentId,
        p_appointment_date: newAppointmentISO,
        p_duration_min: null,
        p_appointment_status: null,
        p_barber_id: null,
        p_allow_override: false,
      });

      if (rpcError) return { data: null, error: rpcError };

      const { data, error } = await supabaseClient
        .from('appointments')
        .select(BASE_SELECT)
        .eq('id', appointmentId)
        .maybeSingle();

      return { data: (data as Appointment | null) ?? null, error };
    },

    async cancelAppointment(appointmentId, cancelledBy) {
      void cancelledBy;
      const { error: rpcError } = await supabaseClient.rpc(cancelRpcName, {
        p_appointment_id: appointmentId,
      });

      if (rpcError) return { data: null, error: rpcError };

      const { data, error } = await supabaseClient
        .from('appointments')
        .select(BASE_SELECT)
        .eq('id', appointmentId)
        .maybeSingle();

      return { data: (data as Appointment | null) ?? null, error };
    },
  };
}

export function createSupabaseTimezoneGateway(supabaseClient: SupabaseClient): TimezoneGateway {
  return {
    async getBusinessTimezone(businessId) {
      const { data, error } = await supabaseClient
        .from('business')
        .select('timezone')
        .eq('id', businessId)
        .maybeSingle();

      return { timezone: data?.timezone ? String(data.timezone) : null, error };
    },
  };
}

export function createSupabaseSlotsGateway(
  supabaseClient: SupabaseClient,
  config?: { edgeFunctionName?: string }
): SlotsGateway {
  const edgeFunctionName = config?.edgeFunctionName ?? 'feiver-dynamic-slots';

  return {
    async fetchSlots({ businessId, barberId, serviceId, date }) {
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;

        const { data, error } = await supabaseClient.functions.invoke(edgeFunctionName, {
          body: {
            business_id: businessId,
            barber_id: barberId,
            requested_date: dateStr,
            service_id: serviceId,
          },
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (error) return { perfect: [], other: [], error };

        const perfect = Array.isArray(data?.perfect) ? (data.perfect as Slot[]) : [];
        const other = Array.isArray(data?.other) ? (data.other as Slot[]) : [];

        return { perfect, other, error: null };
      } catch (error) {
        return { perfect: [], other: [], error };
      }
    },

    async verifySlot({ businessId, barberId, serviceId, timezone, selectedISO }) {
      try {
        const inBiz = DateTime.fromISO(selectedISO).setZone(timezone);
        const dateStr = inBiz.toFormat('yyyy-LL-dd');
        const timeHHmm = inBiz.toFormat('HH:mm');

        const { data: sessionData } = await supabaseClient.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;

        const { data, error } = await supabaseClient.functions.invoke(edgeFunctionName, {
          body: {
            business_id: businessId,
            barber_id: barberId,
            requested_date: dateStr,
            service_id: serviceId,
            requested_time: timeHHmm,
          },
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (error) return false;

        const perfect: Array<{ value: string }> = Array.isArray(data?.perfect) ? data.perfect : [];
        const other: Array<{ value: string }> = Array.isArray(data?.other) ? data.other : [];
        return perfect.some((s) => s.value === timeHHmm) || other.some((s) => s.value === timeHHmm);
      } catch {
        return false;
      }
    },
  };
}
