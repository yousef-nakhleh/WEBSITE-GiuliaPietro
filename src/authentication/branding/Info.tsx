import { useState, useRef, useEffect } from "react";

export default function Info() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-600 text-[10px] font-bold hover:border-gray-600 hover:text-gray-800 transition-colors ml-0.3 -translate-y-[0.03cm]"
        aria-label="Informazioni partnership"
      >
        i
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute left-1/2 top-6 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-3 z-50 text-black text-xs sm:left-0 sm:max-w-none sm:translate-x-0"
        >
          Il salone è partner affiliato a SEF AI. Utilizza le stesse credenziali usate negli altri saloni.
        </div>
      )}
    </span>
  );
}
