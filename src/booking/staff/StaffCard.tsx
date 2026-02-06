// src/booking/staff/StaffCard.tsx
import { Staff } from './useStaff';

interface StaffCardProps {
  staff: Staff;
  onSelect: (staff: Staff) => void;
  className?: string;
}

export const StaffCard = ({
  staff,
  onSelect,
  className = '',
}: StaffCardProps) => {
  return (
    <button
      onClick={() => onSelect(staff)}
      className={`group flex-shrink-0 h-full w-full min-h-full max-h-full bg-[#f5f1ed] rounded-2xl overflow-hidden text-left transition-all duration-300 hover:shadow-2xl ring-1 ring-gray-200 hover:ring-2 hover:ring-[#E8E0D5] ${className} flex flex-col`}
    >
      <div className="flex-1 overflow-hidden rounded-t-2xl flex-shrink-0">
        <img
          src="/assets/model8.webp"
          alt={staff.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex-shrink-0">
        <h3 className="text-base font-heading font-bold text-black text-center">
          {staff.name}
        </h3>
      </div>
    </button>
  );
};
