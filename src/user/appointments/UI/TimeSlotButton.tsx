import type { Slot } from '../types';

type Props = {
  slot: Slot;
  isSelected: boolean;
  onClick: () => void;
};

export function TimeSlotButton({ slot, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border-2 text-sm font-primary transition ${
        isSelected
          ? 'bg-gold text-black border-gold shadow'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {slot.label}
    </button>
  );
}
