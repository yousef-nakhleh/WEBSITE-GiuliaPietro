// src/booking/staff/StaffList.tsx
import { Staff } from './useStaff';
import { StaffCard } from './StaffCard';

interface StaffListProps {
  staff: Staff[];
  onStaffSelect: (staff: Staff) => void;
  className?: string;
  cardClassName?: string;
}

export const StaffList = ({
  staff,
  onStaffSelect,
  className = '',
  cardClassName,
}: StaffListProps) => {
  return (
    <div className={className || "mx-auto max-w-4xl"}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {staff.map((member) => (
          <div key={member.id} className="h-[280px] md:h-[360px]">
            <StaffCard
              staff={member}
              onSelect={onStaffSelect}
              className={cardClassName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
