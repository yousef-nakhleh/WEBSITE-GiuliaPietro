// src/user/appointments/AppointmentCard.tsx
import { DateTime } from "luxon";
import type { Appointment } from "./types";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

type Props = {
  appointment: Appointment;
  businessTimezone: string;
  onEdit?: () => void;
  onCancel?: () => void;
  isBusy?: boolean;
};

export default function AppointmentCard({
  appointment,
  businessTimezone,
  onEdit,
  onCancel,
  isBusy = false,
}: Props) {
  const dtLocal = DateTime.fromISO(appointment.appointment_date).setZone(businessTimezone);

  const isPast = DateTime.fromISO(appointment.appointment_date) < DateTime.utc();
  const isCancelled = appointment.appointment_status === "cancelled";
  const showActions = !!onEdit && !!onCancel && !isPast && !isCancelled;

  const primaryService = appointment.appointment_services?.[0];

  const fallbackServiceLabel = primaryService?.service_id
    ? `Servizio #${primaryService.service_id.slice(0, 6)}`
    : "Servizio non disponibile";

  const fallbackBarberLabel = appointment.barber_id
    ? `#${appointment.barber_id.slice(0, 6)}`
    : "Barbiere non disponibile";

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4 sm:p-5">
      {/* Top row: date/time pill */}
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center">
          <span className="text-black font-heading text-xs sm:text-sm">📅</span>
        </div>
        <div className="leading-tight">
          <div className="font-heading font-semibold text-black text-sm sm:text-base">
            {dtLocal.toFormat("dd LLL yyyy")}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {dtLocal.toFormat("HH:mm")}
          </div>
        </div>

        <div className="ml-auto">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              isCancelled
                ? "border-red-300 text-red-700 bg-red-50"
                : isPast
                ? "border-gray-300 text-gray-700 bg-gray-50"
                : "border-green-300 text-green-700 bg-green-50"
            }`}
          >
            {isCancelled ? "Annullato" : isPast ? "Passato" : "Prossimo"}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div>
          <div className="text-gray-600">Servizio</div>
          <div className="font-heading font-semibold text-black">
            {primaryService?.services?.name ?? fallbackServiceLabel}
          </div>
        </div>

        <div>
          <div className="text-gray-600">Barbiere</div>
          <div className="font-heading font-semibold text-black">
            {appointment.barbers?.name ?? fallbackBarberLabel}
          </div>
        </div>

        {appointment.duration_min != null && (
          <div>
            <div className="text-gray-600">Durata</div>
            <div className="font-heading font-semibold text-black">
              {appointment.duration_min} min
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
          <EditButton onClick={onEdit!} loading={isBusy} />
          <DeleteButton onClick={onCancel!} loading={isBusy} />
        </div>
      )}
    </div>
  );
}