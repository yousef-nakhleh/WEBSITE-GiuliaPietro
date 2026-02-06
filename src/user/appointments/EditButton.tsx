// src/user/components/EditButton.tsx
type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function EditButton({ onClick, loading = false, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Attendere…" : "Modifica"}
    </button>
  );
} 