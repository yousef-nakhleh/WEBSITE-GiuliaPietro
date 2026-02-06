import { useEffect, useState } from 'react';
import type { AppointmentsGateway } from '../api/gateways';
import type { Appointment } from '../types';

export function useAppointmentsQuery({
  userId,
  businessId,
  appointmentsGateway,
  minuteTick,
}: {
  userId: string | null | undefined;
  businessId: string;
  appointmentsGateway: AppointmentsGateway;
  minuteTick: number;
}) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const { data, error } = await appointmentsGateway.getAppointments(userId, businessId);

      if (cancelled) return;

      if (error) {
        setError(error.message ?? 'Errore nel caricamento appuntamenti');
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
  }, [appointmentsGateway, businessId, userId, minuteTick]);

  const reload = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    const { data, error } = await appointmentsGateway.getAppointments(userId, businessId);
    if (error) {
      setError(error.message ?? 'Errore nel caricamento appuntamenti');
      setAppointments(null);
    } else {
      setAppointments(data ?? []);
    }
    setLoading(false);
  };

  return { appointments, loading, error, reload };
}
