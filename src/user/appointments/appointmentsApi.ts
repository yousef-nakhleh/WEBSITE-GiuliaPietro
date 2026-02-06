// src/api/appointmentsApi.ts
import { supabase } from "../../lib/supabase";

import type { Appointment } from "./types";

const BASE_SELECT =
  "id,business_id,barber_id,profile_id,appointment_date,appointment_status,duration_min,appointment_services(id,service_id,duration_minutes,notes,services(name)),barbers(name)";

export async function getAppointments(userId: string, businessId: string) {
  // Upcoming first, then past — your UI can split if desired
  const { data, error } = await supabase
    .from("appointments")
    .select(BASE_SELECT)
    .eq("profile_id", userId)
    .eq("business_id", businessId)
    .order("appointment_date", { ascending: true });

  return { data: (data as Appointment[] | null) ?? null, error };
}

export async function updateAppointmentDate(
  appointmentId: string,
  newAppointmentISO: string,
  _updatedBy?: string
) {
  const { error: rpcError } = await supabase.rpc("update_appointment", {
    p_appointment_id: appointmentId,
    p_appointment_date: newAppointmentISO,
    p_duration_min: null,           // NEW: required parameter
    p_appointment_status: null,     // NEW: required parameter
    p_barber_id: null,              // NEW: required parameter
    p_allow_override: false         // NEW: website respects rules
  });

  if (rpcError) {
    return { data: null, error: rpcError };
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(BASE_SELECT)
    .eq("id", appointmentId)
    .maybeSingle();

  return { data: (data as Appointment | null) ?? null, error };
}

export async function cancelAppointment(appointmentId: string, _cancelledBy?: string) {
  const { error: rpcError } = await supabase.rpc("cancel_appointment", {
    p_appointment_id: appointmentId,
  });

  if (rpcError) {
    return { data: null, error: rpcError };
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(BASE_SELECT)
    .eq("id", appointmentId)
    .maybeSingle();

  return { data: (data as Appointment | null) ?? null, error };
}