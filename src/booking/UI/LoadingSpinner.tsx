// src/booking/UI/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  message = 'Caricamento...', 
  className = '' 
}: LoadingSpinnerProps) => {
  return (
    <div className={className || "min-h-screen flex flex-col items-center justify-center"}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-600 font-primary">{message}</p>
    </div>
  );
};