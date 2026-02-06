import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../logic/LoginForm";
import SEFAI from "../branding/SEFAI";
import "../css/auth-theme.css";

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, isRecoveringPassword, requiresPasswordSetup } = useAuth();
  const [step, setStep] = useState<"email" | "password" | "otp" | "createPassword" | "resetPassword">("email");

  useEffect(() => {
    if (!isOpen) return;
    if (
      user &&
      !isRecoveringPassword &&
      !requiresPasswordSetup &&
      step !== "otp" &&
      step !== "createPassword" &&
      step !== "resetPassword"
    ) {
      onClose();
    }
  }, [user, isRecoveringPassword, requiresPasswordSetup, isOpen, onClose, step]);

  useEffect(() => {
    if (isOpen) {
      setStep("email");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (step) {
      case "email":
        return "Accedi";
      case "password":
        return "Verifica";
      case "otp":
        return "Verifica l'Account";
      case "createPassword":
        return "Crea password";
      case "resetPassword":
        return "Reimposta password";
      default:
        return "Accedi";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "email":
        return "Inserisci la tua email per continuare";
      case "password":
        return "Bentornato, inserisci la password";
      case "otp":
        return "";
      case "createPassword":
        return "Crea una password per il tuo account";
      case "resetPassword":
        return "Crea una nuova password per il tuo account";
      default:
        return "";
    }
  };

  const shouldHideCloseButton = requiresPasswordSetup || step === "createPassword";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-xs sm:max-w-sm bg-white shadow-xl p-6 sm:p-8 flex flex-col items-center text-black relative auth-modal">
        {!shouldHideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            ✕
          </button>
        )}
        <h2 className="text-2xl font-semibold mb-1 text-center auth-font-primary auth-text-primary">
          {getTitle()}
        </h2>
        {getDescription() && (
          <p className="text-sm mb-4 text-center auth-font-primary auth-text-muted">
            {getDescription()}
          </p>
        )}
        <LoginForm onClose={onClose} onStepChange={setStep} />
        <SEFAI className="mt-3 w-full" />
      </div>
    </div>
  );
}
