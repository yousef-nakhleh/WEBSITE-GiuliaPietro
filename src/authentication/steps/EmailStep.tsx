import { Mail } from "lucide-react";

type EmailStepProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
};

export default function EmailStep({
  email,
  onEmailChange,
  onSubmit,
  loading,
  error,
}: EmailStepProps) {
  return (
    <>
      <div className="w-full flex flex-col gap-3 mb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="w-4 h-4" />
          </span>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 text-black text-sm auth-input"
            autoFocus
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-left w-full mb-2 auth-font-primary">{error}</p>
      )}

      <button
        onClick={onSubmit}
        className="w-full font-medium py-2 shadow transition mb-2 mt-2 auth-btn-primary"
        disabled={loading}
      >
        {loading ? "Verifica..." : "Continua"}
      </button>
    </>
  );
}
