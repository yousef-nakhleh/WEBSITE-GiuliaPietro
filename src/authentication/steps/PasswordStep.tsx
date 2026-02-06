import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

type PasswordStepProps = {
  email: string;
  onSubmit: (password: string) => void;
  onForgotPassword: () => void;
  onChangeEmail: () => void;
  loading: boolean;
  error: string | null;
};

export default function PasswordStep({
  email,
  onSubmit,
  onForgotPassword,
  onChangeEmail,
  loading,
  error,
}: PasswordStepProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            onKeyDown={(e) => e.key === "Enter" && onSubmit(password)}
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
      </div>

      {error && (
        <p className="text-sm text-red-500 text-left w-full mb-2 auth-font-primary">{error}</p>
      )}

      <button
        onClick={() => onSubmit(password)}
        className="w-full font-medium py-2 shadow transition mb-2 mt-2 auth-btn-primary"
        disabled={loading}
      >
        {loading ? "Accesso..." : "Accedi"}
      </button>

      <div className="w-full flex items-center justify-between text-sm">
        <button
          onClick={onForgotPassword}
          disabled={loading}
          className="text-gray-600 hover:text-black transition disabled:text-gray-400 disabled:cursor-not-allowed auth-font-primary"
        >
          Password dimenticata?
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
