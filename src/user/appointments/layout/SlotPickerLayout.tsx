import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';
import type { Slot } from '../types';
import { TimeSlotButton } from '../UI/TimeSlotButton';

type Props = {
  date: Date;
  businessTimezone: string;
  perfectSlots: Slot[];
  otherSlots: Slot[];
  selectedTime: string;
  onDateChange: (date: Date) => void;
  onSelectTime: (time: string) => void;
};

export default function SlotPickerLayout({
  date,
  businessTimezone,
  perfectSlots,
  otherSlots,
  selectedTime,
  onDateChange,
  onSelectTime,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">Seleziona data</div>
      <DatePicker
        selected={date}
        onChange={(d) => onDateChange(d!)}
        dateFormat="dd/MM/yyyy"
        minDate={new Date(
          DateTime.now().setZone(businessTimezone).year,
          DateTime.now().setZone(businessTimezone).month - 1,
          DateTime.now().setZone(businessTimezone).day
        )}
        className="p-3 border-2 border-gray-300 rounded-lg font-primary text-black placeholder-gray-400 focus:border-gold focus:outline-none transition-colors text-center"
        calendarClassName="custom-datepicker"
        popperPlacement="bottom-start"
        popperClassName="rdp-popper"
      />

      <div className="space-y-3">
        {perfectSlots.length > 0 && (
          <>
            <div className="text-sm font-heading text-black">Orari consigliati</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {perfectSlots.map((slot) => (
                <TimeSlotButton
                  key={slot.value}
                  slot={slot}
                  isSelected={selectedTime === slot.value}
                  onClick={() => onSelectTime(slot.value)}
                />
              ))}
            </div>
          </>
        )}

        {otherSlots.length > 0 && (
          <>
            <div className="text-sm font-heading text-black">Altri orari</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {otherSlots.map((slot) => (
                <TimeSlotButton
                  key={slot.value}
                  slot={slot}
                  isSelected={selectedTime === slot.value}
                  onClick={() => onSelectTime(slot.value)}
                />
              ))}
            </div>
          </>
        )}

        {perfectSlots.length === 0 && otherSlots.length === 0 && (
          <p className="text-gray-500 text-sm">Nessun orario disponibile per questa data.</p>
        )}
      </div>
    </div>
  );
}
