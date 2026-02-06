// src/booking/slots/layout/TimeSlotButton.tsx
interface TimeSlotButtonProps {
  slot: { label: string; value: string };
  isSelected: boolean;
  onClick: () => void;
  isPerfect?: boolean;
  className?: string;
}

export const TimeSlotButton = ({
  slot,
  isSelected,
  onClick,
  isPerfect = false,
  className = '',
}: TimeSlotButtonProps) => {
  const baseClasses = className || `p-2 rounded-lg border text-xs sm:text-sm font-primary transition-all duration-300 ${
    isSelected
      ? 'bg-[#E8E0D5] text-black border-black shadow-lg'
      : isPerfect
      ? 'bg-green-50 border-black text-green-800 hover:bg-green-100'
      : 'bg-white border-black text-gray-700 hover:bg-gray-50'
  }`;

  return (
    <button onClick={onClick} className={baseClasses}>
      <div className="flex flex-col items-center">
        <span className="font-semibold">{slot.label}</span>
        {isPerfect && (
          <span className="text-xs text-green-600 mt-1">Consigliato</span>
        )}
      </div>
    </button>
  );
};
