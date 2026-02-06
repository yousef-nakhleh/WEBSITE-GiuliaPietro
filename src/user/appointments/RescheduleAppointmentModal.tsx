import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import SlotPicker from './SlotPicker';
import type { Appointment } from './types';
import type { AppointmentsGateway, SlotsGateway, TimezoneGateway } from './api/gateways';
import RescheduleAppointmentModalView from './UI/RescheduleAppointmentModalView';

type Props = {
  open: boolean;
  appointment: Appointment;
  businessTimezone: string;
  minuteTick: number;
  slotsGateway: SlotsGateway;
  timezoneGateway: TimezoneGateway;
  appointmentsGateway: AppointmentsGateway;
  actorId?: string;
  onClose: () => void;
  onSuccess: () => void;
  onStart?: (id: string) => void;
  onEnd?: () => void;
};

export default function RescheduleAppointmentModal({
  open,
  appointment,
  businessTimezone,
  minuteTick,
  slotsGateway,
  timezoneGateway,
  appointmentsGateway,
  actorId,
  onClose,
  onSuccess,
  onStart,
  onEnd,
}: Props) {
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectionResetTick, setSelectionResetTick] = useState(0);
  const primaryServiceId = appointment.appointment_services?.[0]?.service_id ?? null;

  useEffect(() => {
    if (!open) {
      setSelectedISO(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelectionResetTick((t) => t + 1);
    }
  }, [minuteTick, open]);

  const handleConfirm = async () => {
    if (!selectedISO) return;
    if (!primaryServiceId || !appointment.barber_id) {
      alert("Dati dell'appuntamento incompleti. Contatta il supporto.");
      return;
    }

    try {
      onStart?.(appointment.id);
      setSubmitting(true);

      const ok = await slotsGateway.verifySlot({
        businessId: appointment.business_id,
        barberId: appointment.barber_id,
        serviceId: primaryServiceId,
        timezone: businessTimezone,
        selectedISO,
      });

      if (!ok) {
        setSelectedISO(null);
        setSelectionResetTick((t) => t + 1);
        alert("L'orario selezionato non è più disponibile. Scegli un altro orario.");
        return;
      }

      const { error } = await appointmentsGateway.updateAppointmentDate(
        appointment.id,
        selectedISO,
        actorId
      );

      if (error) {
        alert('Errore durante la riprogrammazione.');
      } else {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
      onEnd?.();
    }
  };

  const currentLocal = DateTime.fromISO(appointment.appointment_date).setZone(businessTimezone);

  return (
    <RescheduleAppointmentModalView
      open={open}
      currentLocalLabel={currentLocal.toFormat('dd/LL/yyyy HH:mm')}
      selectedISO={selectedISO}
      submitting={submitting}
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <SlotPicker
        businessId={appointment.business_id}
        serviceId={primaryServiceId}
        barberId={appointment.barber_id}
        initialISO={appointment.appointment_date}
        minuteTick={minuteTick}
        resetSelectionTick={selectionResetTick}
        onChangeISO={setSelectedISO}
        slotsGateway={slotsGateway}
        timezoneGateway={timezoneGateway}
      />
    </RescheduleAppointmentModalView>
  );
}
