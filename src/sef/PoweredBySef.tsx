// src/sef/PoweredBySef.tsx
import React from 'react';

type Props = {
  className?: string;          // extra spacing overrides if needed
  muted?: boolean;             // use a lighter text (e.g., on darker footers)
  href?: string;               // link target
};

const PoweredBySef: React.FC<Props> = ({
  className = '',
  muted = false,
  href = 'https://www.sef-ai.com', // ✅ official link
}) => {
  // palette
  const sep = 'bg-[#e9e0d7]';              // subtle divider line
  const base = muted ? 'text-[#8c7a6a]' : 'text-[#6e5a49]';
  const hover = 'hover:text-[#a88a69]';    // goldish hover tone

  return (
    <div className={`w-full ${className}`}>
      {/* subtle separator line */}
      <div className={`h-px w-full ${sep} mb-4`} />

      {/* full clickable phrase */}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Visita SEF-AI"
        className={`block text-center ${base} ${hover} transition-colors duration-200 text-sm md:text-[15px] leading-relaxed tracking-wide font-medium`}
      >
        Powered by SEF-AI
      </a>
    </div>
  );
};

export default PoweredBySef;