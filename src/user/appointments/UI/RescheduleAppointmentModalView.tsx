type Props = {
  open: boolean;
  currentLocalLabel: string;
  selectedISO: string | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
};

export default function RescheduleAppointmentModalView({
  open,
  currentLocalLabel,
  selectedISO,
  submitting,
  onClose,
  onConfirm,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-lg bg-white text-black rounded-t-2xl md:rounded-2xl shadow-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-black">Riprogramma appuntamento</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Attuale: <span className="font-semibold text-black">{currentLocalLabel}</span>
        </p>

        {children}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border-2 border-gray-300">
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedISO || submitting}
            className="px-4 py-2 rounded-lg bg-gold text-black font-heading font-semibold disabled:opacity-50"
          >
            {submitting ? 'Salvataggio…' : 'Conferma'}
          </button>
        </div>
      </div>
    </div>
  );
}
