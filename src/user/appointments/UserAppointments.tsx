import { useMemo, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import RescheduleAppointmentModal from './RescheduleAppointmentModal';
import ConfirmCancelModal from './ConfirmCancelModal';
import type { Appointment } from './types';
import type {
  AppointmentsGateway,
  SlotsGateway,
  TimezoneGateway,
} from './api/gateways';
import { useAppointmentsQuery } from './hooks/useAppointmentsQuery';
import { useBusinessTimezone } from './hooks/useBusinessTimezone';
import { splitAppointments } from './logic/splitAppointments';
import AppointmentsFeatureLayout from './layout/AppointmentsFeatureLayout';
import LoginRequiredAppointments from './UI/LoginRequiredAppointments';

export type UserAppointmentsProps = {
  businessId: string;
  appointmentsGateway: AppointmentsGateway;
  slotsGateway: SlotsGateway;
  timezoneGateway: TimezoneGateway;
  useAuthHook: () => { user: { id?: string } | null; profile?: { id?: string } | null };
  useMinuteAlignedTickHook: (intervalMinutes?: number) => number;
};

export default function UserAppointments({
  businessId,
  appointmentsGateway,
  slotsGateway,
  timezoneGateway,
  useAuthHook,
  useMinuteAlignedTickHook,
}: UserAppointmentsProps) {
  const { user, profile } = useAuthHook();
  const userId = user?.id ?? null;
  const liveMinuteTick = useMinuteAlignedTickHook();

  const { appointments, loading, error, reload } = useAppointmentsQuery({
    userId,
    businessId,
    appointmentsGateway,
    minuteTick: liveMinuteTick,
  });

  const { businessTimezone, timezoneLoading, timezoneError } = useBusinessTimezone({
    userId,
    businessId,
    timezoneGateway,
  });

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { upcoming, past } = useMemo(() => splitAppointments(appointments), [appointments]);

  if (!user) return <LoginRequiredAppointments />;

  return (
    <>
      <AppointmentsFeatureLayout
        loading={loading}
        timezoneLoading={timezoneLoading}
        error={error}
        timezoneError={timezoneError}
        businessTimezone={businessTimezone}
        upcoming={upcoming}
        past={past}
        busyId={busyId}
        renderCard={(appointment, options) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            businessTimezone={businessTimezone!}
            isBusy={options.busy}
            onEdit={options.isUpcoming ? () => setEditing(appointment) : undefined}
            onCancel={options.isUpcoming ? () => setToCancel(appointment) : undefined}
          />
        )}
      />

      {editing && businessTimezone && (
        <RescheduleAppointmentModal
          open={!!editing}
          appointment={editing}
          businessTimezone={businessTimezone}
          minuteTick={liveMinuteTick}
          slotsGateway={slotsGateway}
          timezoneGateway={timezoneGateway}
          appointmentsGateway={appointmentsGateway}
          actorId={profile?.id}
          onClose={() => setEditing(null)}
          onStart={(id) => setBusyId(id)}
          onEnd={() => setBusyId(null)}
          onSuccess={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      {toCancel && businessTimezone && (
        <ConfirmCancelModal
          open={!!toCancel}
          appointment={toCancel}
          businessTimezone={businessTimezone}
          appointmentsGateway={appointmentsGateway}
          actorId={profile?.id}
          onClose={() => setToCancel(null)}
          onStart={(id) => setBusyId(id)}
          onEnd={() => setBusyId(null)}
          onSuccess={() => {
            setToCancel(null);
            reload();
          }}
        />
      )}
    </>
  );
}
