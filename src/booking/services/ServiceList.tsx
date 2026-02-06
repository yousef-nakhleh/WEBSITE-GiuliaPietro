// src/booking/services/ServiceList.tsx
import { useState, useRef, useEffect } from 'react';
import { Service } from './useServices';
import { ServiceCard } from './ServiceCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  selectedServiceIds: string[];
  onServiceToggle: (serviceId: string) => void;
  onServiceHover?: (service: Service) => void;
  onServiceLeave?: () => void;
  className?: string;
  cardClassName?: string;
}

const SERVICE_IMAGES = [
  '/assets/images/colorebase',
  '/assets/images/effettiluce',
  '/assets/images/schiariture',
  '/assets/images/tagliouomo',
  '/assets/images/ricostruzione',
  '/assets/images/tagliodonna',
  '/assets/images/tonalizzante',
  '/assets/images/piega',
];

export const ServiceList = ({
  services,
  selectedServiceIds,
  onServiceToggle,
  onServiceHover,
  onServiceLeave,
  className = '',
  cardClassName,
}: ServiceListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const canScrollLeft = currentIndex > 0;
  // For desktop: show 4 full cards + 0.5 partial, so can scroll if there are more than 4 cards ahead
  // For mobile: keep existing logic
  const cardsAhead = cardsPerView === 4 ? 4 : cardsPerView;
  const canScrollRight = currentIndex + cardsAhead < services.length;

  const handleScrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className={className || "mx-auto max-w-7xl px-4"}>
      <div className="relative">
        <button
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-4 z-10 bg-black text-white p-2 sm:p-3 rounded-full transition-all duration-300 ${
            canScrollLeft
              ? 'opacity-100 hover:bg-[#E8E0D5] hover:scale-110'
              : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div
          className={`overflow-hidden py-2 scroll-melt-mask ${
            canScrollLeft && canScrollRight
              ? 'scroll-melt-mask--both'
              : canScrollLeft
                ? 'scroll-melt-mask--left'
                : canScrollRight
                  ? 'scroll-melt-mask--right'
                  : ''
          }`}
          ref={containerRef}
        >
          <div
            className="flex gap-2 md:gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: cardsPerView === 4
                ? `translateX(-${(currentIndex * 100) / cardsPerView}%)`
                : `translateX(-${currentIndex * 38.5}%)`,
            }}
          >
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex-shrink-0 ${
                  cardsPerView === 4 ? 'w-[calc(22.22%-12px)] min-w-[calc(22.22%-12px)] max-w-[calc(22.22%-12px)]' : 'w-[38%]'
                } h-[336px] md:h-[396px]`}
              >
                <ServiceCard
                  service={service}
                  selected={selectedServiceIds.includes(service.id)}
                  onSelect={() => onServiceToggle(service.id)}
                  onHover={onServiceHover}
                  onLeave={onServiceLeave}
                  className={cardClassName}
                  imageUrl={SERVICE_IMAGES[index % SERVICE_IMAGES.length]}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-4 z-10 bg-black text-white p-2 sm:p-3 rounded-full transition-all duration-300 ${
            canScrollRight
              ? 'opacity-100 hover:bg-[#E8E0D5] hover:scale-110'
              : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};
