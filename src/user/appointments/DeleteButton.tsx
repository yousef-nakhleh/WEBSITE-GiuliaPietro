// src/user/components/DeleteButton.tsx
type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function DeleteButton({ onClick, loading = false, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Attendere…" : "Annulla"}
    </button>
  );
}