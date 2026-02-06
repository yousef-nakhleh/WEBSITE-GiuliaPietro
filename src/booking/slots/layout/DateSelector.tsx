// src/booking/slots/layout/DateSelector.tsx
import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import it from 'date-fns/locale/it';

registerLocale('it', it);

const ReadOnlyDateInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ value, onClick, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      value={typeof value === 'string' ? value : ''}
      onClick={onClick}
      readOnly
    />
  ),
);

ReadOnlyDateInput.displayName = 'ReadOnlyDateInput';

interface DateSelectorProps {
  selected: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  className?: string;
  inputClassName?: string;
}

export const DateSelector = ({
  selected,
  onChange,
  minDate = new Date(),
  className = '',
  inputClassName = '',
}: DateSelectorProps) => {
  return (
    <div className={className || "text-center"}>
      <div className="inline-block">
        <DatePicker
          selected={selected}
          onChange={(date) => date && onChange(date)}
          dateFormat="dd/MM/yyyy"
          minDate={minDate}
          locale="it"
          formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 2)}
          dayClassName={(day) => {
            const weekday = day.getDay();
            return weekday === 0 || weekday === 1 ? 'react-datepicker__day--off' : undefined;
          }}
          calendarClassName="custom-datepicker"
          customInput={
            <ReadOnlyDateInput
              className={inputClassName || "p-3 border-2 border-gray-300 rounded-lg font-primary text-black placeholder-gray-400 focus:border-[#E8E0D5] focus:outline-none transition-colors text-center"}
            />
          }
        />
      </div>
    </div>
  );
};
