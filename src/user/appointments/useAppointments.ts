// src/hooks/useAppointments.ts
import { useEffect, useState } from "react";
import type { Appointment } from "./types";
import * as appointmentsApi from "./appointmentsApi";
import useMinuteAlignedTick from "../../booking/slots/hooks/useMinuteAlignedTick";

export function useAppointments(
  userId: string | null | undefined,
  businessId: string
) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const minuteTick = useMinuteAlignedTick();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!userId) {
        setAppointments(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error } = await appointmentsApi.getAppointments(
        userId,
        businessId
      );

      if (cancelled) return;

      if (error) {
        setError(error.message ?? "Errore nel caricamento appuntamenti");
        setAppointments(null);
      } else {
        setAppointments(data ?? []);
      }
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [userId, businessId, minuteTick]);

  const reload = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await appointmentsApi.getAppointments(
      userId,
      businessId
    );
    if (error) {
      setError(error.message ?? "Errore nel caricamento appuntamenti");
      setAppointments(null);
    } else {
      setAppointments(data ?? []);
    }
    setLoading(false);
  };

  return {
    appointments,
    loading,
    error,
    reload,
  };
}
