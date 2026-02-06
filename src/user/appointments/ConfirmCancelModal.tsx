import { useState } from 'react';
import { DateTime } from 'luxon';
import type { Appointment } from './types';
import type { AppointmentsGateway } from './api/gateways';
import ConfirmCancelModalView from './UI/ConfirmCancelModalView';

type Props = {
  open: boolean;
  appointment: Appointment;
  businessTimezone: string;
  appointmentsGateway: AppointmentsGateway;
  actorId?: string;
  onClose: () => void;
  onSuccess: () => void;
  onStart?: (id: string) => void;
  onEnd?: () => void;
};

export default function ConfirmCancelModal({
  open,
  appointment,
  businessTimezone,
  appointmentsGateway,
  actorId,
  onClose,
  onSuccess,
  onStart,
  onEnd,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const dtLocal = DateTime.fromISO(appointment.appointment_date).setZone(businessTimezone);
  const primaryService = appointment.appointment_services?.[0];
  const serviceLabel =
    primaryService?.services?.name ??
    (primaryService?.service_id
      ? `Servizio #${primaryService.service_id.slice(0, 6)}`
      : 'Appuntamento');

  const handleConfirm = async () => {
    try {
      onStart?.(appointment.id);
      setSubmitting(true);
      const { error } = await appointmentsGateway.cancelAppointment(appointment.id, actorId);

      if (error) {
        alert("Errore durante l'annullamento.");
      } else {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
      onEnd?.();
    }
  };

  return (
    <ConfirmCancelModalView
      open={open}
      subtitle={`${dtLocal.toFormat('dd/LL/yyyy HH:mm')} — ${serviceLabel}`}
      submitting={submitting}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}
