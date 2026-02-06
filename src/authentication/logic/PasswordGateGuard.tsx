import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import CreatePassword from "./CreatePassword";
import ResetPassword from "./ResetPassword";

interface PasswordGateGuardProps {
  children: ReactNode;
}

export default function PasswordGateGuard({ children }: PasswordGateGuardProps) {
  const { user, requiresPasswordSetup, refreshSession } = useAuth();

  const handlePasswordSet = async () => {
    await refreshSession();
  };

  // Determine which component to show
  const hasPassword = user?.user_metadata?.has_password === true;
  const pendingReset = user?.user_metadata?.pending_reset === true;

  // Decide which component to render
  let passwordComponent = null;
  let title = "";
  let description = "";

  if (user && requiresPasswordSetup) {
    if (pendingReset) {
      // User is resetting password
      passwordComponent = (
        <ResetPassword
          email={user.email || ""}
          onSuccess={handlePasswordSet}
        />
      );
      title = "Reimposta Password";
      description = "Aggiorna la tua password";
    } else if (!hasPassword) {
      // New user needs to create password
      passwordComponent = (
        <CreatePassword
          email={user.email || ""}
          onSuccess={handlePasswordSet}
        />
      );
      title = "Password Obbligatoria";
      description = "Crea una password per il tuo account";
    }
  }

  return (
    <>
      {children}
      {passwordComponent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="w-full max-w-xs sm:max-w-sm bg-white shadow-xl p-6 sm:p-8 flex flex-col items-center text-black relative auth-modal">
            <h2 className="text-2xl font-semibold mb-1 text-center auth-font-primary auth-text-primary">
              {title}
            </h2>
            {description && (
              <p className="text-sm mb-4 text-center auth-font-primary auth-text-muted">
                {description}
              </p>
            )}
            {passwordComponent}
          </div>
        </div>
      )}
    </>
  );
}
