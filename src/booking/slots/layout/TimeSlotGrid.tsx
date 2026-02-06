// src/booking/slots/layout/TimeSlotGrid.tsx
import { TimeSlotButton } from './TimeSlotButton';

interface Slot {
  label: string;
  value: string;
}

interface TimeSlotGridProps {
  perfectSlots: Slot[];
  otherSlots: Slot[];
  selectedTime: string;
  onSlotSelect: (value: string) => void;
  className?: string;
  gridClassName?: string;
  buttonClassName?: string;
}

export const TimeSlotGrid = ({
  perfectSlots,
  otherSlots,
  selectedTime,
  onSlotSelect,
  className = '',
  gridClassName = '',
  buttonClassName,
}: TimeSlotGridProps) => {
  const noSlotsAvailable = perfectSlots.length === 0 && otherSlots.length === 0;

  if (noSlotsAvailable) {
    return (
      <div className={className || "text-center"}>
        <p className="text-gray-500 font-primary">
          Nessun orario disponibile per il barbiere selezionato.
        </p>
      </div>
    );
  }

  return (
    <div className={className || "space-y-3"}>
      {perfectSlots.length > 0 && (
        <div>
          <h4 className="text-lg font-heading font-semibold text-black mb-4 text-center">
            Orari Consigliati
          </h4>
          <div className={gridClassName || "grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2"}>
            {perfectSlots.map((slot) => (
              <TimeSlotButton
                key={slot.value}
                slot={slot}
                isSelected={selectedTime === slot.value}
                onClick={() => onSlotSelect(slot.value)}
                isPerfect={true}
                className={buttonClassName}
              />
            ))}
          </div>
        </div>
      )}

      {otherSlots.length > 0 && (
        <div>
          <h4 className="text-lg font-heading font-semibold text-black mb-4 text-center">
            Orari Disponibili
          </h4>
          <div className={gridClassName || "grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2"}>
            {otherSlots.map((slot) => (
              <TimeSlotButton
                key={slot.value}
                slot={slot}
                isSelected={selectedTime === slot.value}
                onClick={() => onSlotSelect(slot.value)}
                className={buttonClassName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};