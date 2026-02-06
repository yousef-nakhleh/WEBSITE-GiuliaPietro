interface SlotsRefreshWarningProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
  dismissText?: string;
}

export const SlotsRefreshWarning = ({
  message,
  className = '',
  onDismiss,
  dismissText = 'OK',
}: SlotsRefreshWarningProps) => {
  return (
    <div
      className={
        className ||
        'rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-primary'
      }
      role="status"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex-1">{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors whitespace-nowrap"
            type="button"
          >
            {dismissText}
          </button>
        )}
      </div>
    </div>
  );
};
