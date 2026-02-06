import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Eye, EyeOff } from "lucide-react";

interface CreatePasswordProps {
  email: string;
  onSuccess: () => void;
}

export default function CreatePassword({ email, onSuccess }: CreatePasswordProps) {
  const { supabaseClient } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (): boolean => {
    if (!password || password.length < 6) {
      setError("La password deve contenere almeno 6 caratteri.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Le password non corrispondono.");
      return false;
    }

    return true;
  };

  const handleCreatePassword = async () => {
    setLoading(true);
    setError(null);

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    const { error } = await supabaseClient.auth.updateUser({
      password: password,
      data: { has_password: true, pending_reset: false },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  const handleCancelAndExit = async () => {
    await supabaseClient.auth.signOut();
    onSuccess();
  };

  const getPasswordStrength = (): string => {
    if (!password) return "";
    if (password.length < 6) return "Debole";
    if (password.length < 10) return "Media";
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return "Forte";
    }
    return "Media";
  };

  const getStrengthColor = (): string => {
    const strength = getPasswordStrength();
    if (strength === "Debole") return "text-red-500";
    if (strength === "Media") return "text-yellow-500";
    if (strength === "Forte") return "text-green-500";
    return "";
  };

  return (
    <>
      <div className="w-full flex flex-col gap-3 mb-2">

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-50 text-black text-sm auth-input"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {password && (
          <p className={`text-xs ${getStrengthColor()} auth-font-primary`}>
            Sicurezza: {getPasswordStrength()}
          </p>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <input
            placeholder="Conferma password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreatePassword()}
            className="w-full pl-10 pr-10 py-2 bg-gray-50 text-black text-sm auth-input"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-left auth-font-primary">
          La password deve contenere almeno 6 caratteri
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-left w-full mb-2 auth-font-primary">{error}</p>
      )}

      <button
        onClick={handleCreatePassword}
        className="w-full font-medium py-2 shadow transition mt-2 auth-btn-primary"
        disabled={loading}
      >
        {loading ? "Salvataggio..." : "Crea account"}
      </button>

      <button
        onClick={handleCancelAndExit}
        className="w-full text-gray-500 text-sm underline hover:text-gray-700 transition mt-3 auth-font-primary"
        disabled={loading}
      >
        Annulla ed esci
      </button>
    </>
  );
}
