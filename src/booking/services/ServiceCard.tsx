// src/booking/services/ServiceCard.tsx
import { Service } from './useServices';
import { Clock, Check } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: () => void;
  onHover?: (service: Service) => void;
  onLeave?: () => void;
  className?: string;
  imageUrl: string;
}

const formatDuration = (minutes?: number | null): string => {
  if (!minutes) return '';
  if (minutes >= 60) {
    return `${minutes}+ min`;
  }
  return `${minutes} min`;
};

const formatPrice = (priceCents?: number | null): string => {
  if (!priceCents) return '';
  const price = priceCents / 100;
  return `€${price.toFixed(2)}`;
};

export const ServiceCard = ({
  service,
  selected,
  onSelect,
  onHover,
  onLeave,
  className = '',
  imageUrl,
}: ServiceCardProps) => {
  return (
    <button
      onClick={onSelect}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => onHover?.(service)}
      onFocus={() => onHover?.(service)}
      onMouseLeave={() => onLeave?.()}
      className={`group flex-shrink-0 h-full w-full min-h-full max-h-full bg-[#f5f1ed] rounded-2xl overflow-hidden text-left transition-all duration-300 hover:shadow-2xl ${selected ? 'ring-2 ring-[#E8E0D5] shadow-2xl' : 'ring-1 ring-gray-200'} ${className} flex flex-col`}
    >
      <div className="flex-1 overflow-hidden rounded-t-2xl flex-shrink-0">
        <picture>
          <source srcSet={`${imageUrl}.webp`} type="image/webp" />
          <img
            src={`${imageUrl}.png`}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </picture>
      </div>

      <div className="p-3 space-y-1.5 flex-shrink-0">
        <h3 className="text-base font-heading font-bold text-black text-center line-clamp-2 min-h-[2.5rem]">
          {service.name}
        </h3>

        {service.duration_min && (
          <div className="flex items-center justify-center gap-1.5 text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-primary">{formatDuration(service.duration_min)}</span>
          </div>
        )}

        {service.price_cents && (
          <div className="text-center">
            <span className="text-sm font-primary font-semibold text-black">{formatPrice(service.price_cents)}</span>
          </div>
        )}

        <div className="pt-2 flex-shrink-0">
          <div className={`w-full py-2 px-4 rounded-xl font-primary font-medium text-sm transition-all duration-300 ${
            selected
              ? 'bg-white text-gray-700 flex items-center justify-center gap-2'
              : 'bg-white/50 text-gray-700 hover:bg-white'
          }`}>
            {selected ? (
              <>
                <Check className="w-4 h-4 text-[#E8E0D5]" />
                <span>Selezionato</span>
              </>
            ) : (
              <span className="text-center w-full">Seleziona</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
