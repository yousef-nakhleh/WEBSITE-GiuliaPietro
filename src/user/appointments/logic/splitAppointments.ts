import { DateTime } from 'luxon';
import type { Appointment } from '../types';

export function splitAppointments(appointments: Appointment[] | null | undefined) {
  const now = DateTime.utc();
  const upcoming: Appointment[] = [];
  const past: Appointment[] = [];

  (appointments ?? []).forEach((appointment) => {
    const dt = DateTime.fromISO(appointment.appointment_date);
    if (dt > now) upcoming.push(appointment);
    else past.push(appointment);
  });

  return { upcoming, past };
}
