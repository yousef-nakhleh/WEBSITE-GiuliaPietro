// src/sections/home/gallery/GalleryContainer.tsx
import { useState } from 'react';
import GalleryCard from './GalleryCard';
import GalleryForm from './GalleryForm';
import CTAs from './CTAs';
import BorderTopLeft from '../../../components/decorations/BorderTopLeft';
import BorderBottomRight from '../../../components/decorations/BorderBottomRight';

const GalleryContainer = () => {
  const [selectedLook, setSelectedLook] = useState<string | null>(null);

  return (
    <section id="galleria" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        {/* Title */}
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-black"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Scegli il look adatto a te
          </h2>
        </div>

        {/* Card + Form */}
        <div className="flex flex-col lg:flex-row justify-center items-start gap-12 mb-8">
          {/* Card wrapper with content-sized box so borders hug the card */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Decorative borders (now correctly offset around the card) */}
            <BorderTopLeft className="absolute -top-6 -left-6 z-20 pointer-events-none" />
            <BorderBottomRight className="absolute -bottom-6 -right-6 z-20 pointer-events-none" />

            <GalleryCard onSelectLook={(lookDesc) => setSelectedLook(lookDesc)} />
          </div>

          <div className="flex-1 max-w-md w-full">
            <GalleryForm selectedLook={selectedLook || ''} />
          </div>
        </div>

        <div className="flex justify-center">
          <CTAs />
        </div>
      </div>
    </section>
  );
};

export default GalleryContainer;
