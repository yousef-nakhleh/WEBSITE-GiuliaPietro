import { useEffect, useState, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: ReactElement;
  guardCheck: () => boolean;
  redirectTo: string;
}

export function ProtectedRoute({ element, guardCheck, redirectTo }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkGuard = () => {
      const result = guardCheck();
      setShouldRender(result);
      setIsChecking(false);
    };

    const timeoutId = setTimeout(checkGuard, 0);

    return () => clearTimeout(timeoutId);
  }, [guardCheck]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return shouldRender ? element : <Navigate to={redirectTo} replace />;
}
