import OTP from "./OTP";
import CreatePassword from "./CreatePassword";
import ResetPassword from "./ResetPassword";
import EmailStep from "../steps/EmailStep";
import PasswordStep from "../steps/PasswordStep";
import { useAuthFlow } from "../hooks/useAuthFlow";

interface LoginFormProps {
  onClose: () => void;
  onStepChange?: (step: "email" | "password" | "otp" | "createPassword" | "resetPassword") => void;
}

export default function LoginForm({ onClose, onStepChange }: LoginFormProps) {
  const {
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
  } = useAuthFlow({ onClose, onStepChange });

  if (step === "otp") {
    return (
      <OTP
        email={emailValidation.value}
        mode="signup"
        onVerified={handleOtpVerified}
        onChangeEmail={handleChangeEmail}
      />
    );
  }

  if (step === "forgotPassword") {
    return (
      <OTP
        email={emailValidation.value}
        mode="reset"
        onVerified={handleOtpVerified}
        onChangeEmail={handleChangeEmail}
      />
    );
  }

  if (step === "createPassword") {
    return (
      <CreatePassword
        email={emailValidation.value}
        onSuccess={handlePasswordSet}
      />
    );
  }

  if (step === "resetPassword") {
    return (
      <ResetPassword
        email={emailValidation.value}
        onSuccess={handlePasswordSet}
      />
    );
  }

  if (step === "password") {
    return (
      <PasswordStep
        email={emailValidation.value}
        loading={loading}
        error={error}
        onSubmit={handlePasswordSubmit}
        onForgotPassword={handleForgotPassword}
        onChangeEmail={handleChangeEmail}
      />
    );
  }

  return (
    <EmailStep
      email={emailValidation.value}
      onEmailChange={emailValidation.setValue}
      onSubmit={handleEmailSubmit}
      loading={loading}
      error={error}
    />
  );
}
