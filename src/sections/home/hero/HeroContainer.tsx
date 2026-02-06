import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Title from './Title';
import Subtitle from './Subtitle';
import CTAs from './CTAs';
import './HeroContainer.css';

const HeroContainer = () => {
  const [arrowOpacity, setArrowOpacity] = useState([0.3, 0.5, 0.7]);

  useEffect(() => {
    const interval = setInterval(() => {
      setArrowOpacity((prev) => {
        const newOpacities = [...prev];
        newOpacities[0] = prev[0] >= 1 ? 0.3 : prev[0] + 0.1;
        newOpacities[1] = prev[1] >= 1 ? 0.5 : prev[1] + 0.1;
        newOpacities[2] = prev[2] >= 1 ? 0.7 : prev[2] + 0.1;
        return newOpacities;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="hero-background relative min-h-[calc(100vh-0px)] w-full overflow-x-hidden bg-center bg-cover flex items-center"
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-center text-white relative">
        <div className="text-center">
          <Title />
          <Subtitle />

          <div className="flex justify-center">
            <div className="h-px w-64 bg-white opacity-50 mb-4" />
          </div>

          <CTAs />
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center space-y-[1px]">
        <ChevronDown
          size={20}
          style={{ opacity: arrowOpacity[0], transform: 'translateY(3px)' }}
          className="text-white animate-pulse"
        />
        <ChevronDown
          size={24}
          style={{ opacity: arrowOpacity[1], transform: 'translateY(2px)' }}
          className="text-white animate-pulse"
        />
        <ChevronDown
          size={28}
          style={{ opacity: arrowOpacity[2] }}
          className="text-white animate-pulse"
        />
      </div>
    </section>
  );
};

export default HeroContainer;