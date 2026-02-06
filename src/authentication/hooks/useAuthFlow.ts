import { useEffect, useState } from "react";
import { useEmailValidation } from "./validateEmail";
import { useAuth } from "../context/AuthContext";
import { checkUserEmail, getUser, sendOtp, signInWithPassword, updateUser } from "./authApi";

export type AuthStep =
  | "email"
  | "password"
  | "otp"
  | "createPassword"
  | "resetPassword"
  | "forgotPassword";

type StepChange = Exclude<AuthStep, "forgotPassword">;

type OtpFlags = { hasPassword: boolean; pendingReset: boolean };

type UseAuthFlowProps = {
  onClose: () => void;
  onStepChange?: (step: StepChange) => void;
};

export const useAuthFlow = ({ onClose, onStepChange }: UseAuthFlowProps) => {
  const emailValidation = useEmailValidation("");
  const { refreshSession, supabaseClient } = useAuth();
  const [step, setStep] = useState<AuthStep>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!onStepChange) return;
    const mappedStep = step === "forgotPassword" ? "otp" : step;
    onStepChange(mappedStep as StepChange);
  }, [step, onStepChange]);

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!emailValidation.validate()) {
      setError(emailValidation.error);
      setLoading(false);
      return;
    }

    try {
      const { exists, hasPassword } = await checkUserEmail(emailValidation.value);

      if (!exists) {
        const { error: otpError } = await sendOtp(supabaseClient, emailValidation.value, true);
        if (otpError) {
          setError(otpError.message);
          setLoading(false);
          return;
        }
        setStep("otp");
      } else if (hasPassword) {
        setStep("password");
      } else {
        const { error: otpError } = await sendOtp(supabaseClient, emailValidation.value, false);
        if (otpError) {
          setError(otpError.message);
          setLoading(false);
          return;
        }
        setStep("otp");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore");
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (password: string) => {
    setLoading(true);
    setError(null);

    if (!password || password.length < 6) {
      setError("Password non valida");
      setLoading(false);
      return;
    }

    const { error: signInError } = await signInWithPassword(
      supabaseClient,
      emailValidation.value,
      password
    );

    if (signInError) {
      setError("Email o password non corretti");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await getUser(supabaseClient);

    if (user?.user_metadata?.pending_reset === true) {
      await updateUser(supabaseClient, { data: { pending_reset: false } });
    }

    await refreshSession();
    onClose();
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);

    const { error: otpError } = await sendOtp(supabaseClient, emailValidation.value, false);

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setStep("forgotPassword");
    setLoading(false);
  };

  const handleOtpVerified = (flags: OtpFlags) => {
    if (step === "forgotPassword") {
      if (flags.pendingReset) {
        setStep("resetPassword");
      } else {
        onClose();
      }
    } else {
      if (!flags.hasPassword) {
        setStep("createPassword");
      } else {
        onClose();
      }
    }
  };

  const handlePasswordSet = async () => {
    await refreshSession();
    onClose();
  };

  const handleChangeEmail = () => {
  emailValidation.setValue("");
  setStep("email");
  setError(null);
};


  return {
    step,
    emailValidation,
    loading,
    error,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleForgotPassword,
    handleOtpVerified,
    handlePasswordSet,
    handleChangeEmail,
  };
};
