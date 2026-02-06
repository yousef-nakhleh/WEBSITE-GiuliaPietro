type Props = {
  open: boolean;
  subtitle: string;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmCancelModalView({
  open,
  subtitle,
  submitting,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-5">
        <h3 className="text-lg font-heading font-semibold text-black mb-2">Confermi annullamento?</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Torna indietro
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {submitting ? 'Annullamento…' : 'Conferma annullamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
