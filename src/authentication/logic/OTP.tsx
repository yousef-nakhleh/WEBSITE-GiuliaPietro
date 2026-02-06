import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Hash } from "lucide-react";

interface OTPProps {
  email: string;
  mode: "signup" | "reset";
  onVerified: (flags: { hasPassword: boolean; pendingReset: boolean }) => void;
  onChangeEmail: () => void;
}

export default function OTP({ email, mode, onVerified, onChangeEmail }: OTPProps) {
  const { supabaseClient } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);

    if (!otp || otp.length !== 6) {
      setError("Per favore, inserisci il codice a 6 cifre.");
      setLoading(false);
      return;
    }

    const { error } = await supabaseClient.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });

    if (error) {
      setError("Codice non valido. Riprova.");
      setLoading(false);
      return;
    }

    console.log("🔍 OTP verified, mode:", mode);

    let flags = { hasPassword: false, pendingReset: false };

    if (mode === "signup") {
      const { error: updateError } = await supabaseClient.auth.updateUser({
        data: { has_password: false, pending_reset: false }
      });

      if (updateError) {
        console.error("❌ Update error (signup):", updateError);
        setError("Errore durante l'aggiornamento. Riprova.");
        setLoading(false);
        return;
      }
      
      flags = { hasPassword: false, pendingReset: false };
      console.log("✅ Signup flags set:", flags);
    } else if (mode === "reset") {
      const { error: updateError } = await supabaseClient.auth.updateUser({
        data: { pending_reset: true }
      });

      if (updateError) {
        console.error("❌ Update error (reset):", updateError);
        setError("Errore durante l'aggiornamento. Riprova.");
        setLoading(false);
        return;
      }
      
      flags = { hasPassword: true, pendingReset: true };
      console.log("✅ Reset flags set:", flags);
    }

    console.log("📤 Calling onVerified with flags:", flags);
    setLoading(false);
    onVerified(flags);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError(null);

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: mode === "signup",
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setResendCooldown(60);
    }

    setLoading(false);
  };

  return (
    <>
      <p className="text-sm mb-4 text-center auth-font-primary auth-text-muted">
        Inserisci il codice di verifica che abbiamo inviato a {email}
      </p>
      <div className="w-full flex flex-col gap-4 mb-2">

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Hash className="w-4 h-4" />
          </span>
          <input
            placeholder="Codice a 6 cifre"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 text-black text-sm text-center text-lg auth-input"
            autoFocus
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-left w-full mb-2 auth-font-primary">{error}</p>
      )}

      <button
        onClick={handleVerifyOtp}
        className="w-full font-medium py-2 shadow transition mb-3 mt-2 auth-btn-primary"
        disabled={loading}
      >
        {loading ? "Verifica..." : "Verifica codice"}
      </button>

      <div className="w-full flex items-center justify-between text-sm">
        <button
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || loading}
          className="text-gray-600 hover:text-black transition disabled:text-gray-400 disabled:cursor-not-allowed auth-font-primary"
        >
          {resendCooldown > 0
            ? `Reinvia codice (${resendCooldown}s)`
            : "Reinvia codice"}
        </button>
        <button
          onClick={onChangeEmail}
          className="text-gray-600 hover:text-black transition auth-font-primary"
        >
          Cambia email
        </button>
      </div>
    </>
  );
}
