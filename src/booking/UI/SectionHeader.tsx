// src/booking/UI/SectionHeader.tsx
interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader = ({ title, className = '' }: SectionHeaderProps) => {
  return (
    <div className={className || "text-center"}>
      <h2 className="text-2xl font-heading font-bold text-black mb-2">{title}</h2>
      <div className="w-20 h-[2px] bg-[#E8E0D5] mx-auto" />
    </div>
  );
};
