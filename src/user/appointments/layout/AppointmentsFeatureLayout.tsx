import type { Appointment } from '../types';

type Props = {
  loading: boolean;
  timezoneLoading: boolean;
  error: string | null;
  timezoneError: string | null;
  businessTimezone: string | null;
  upcoming: Appointment[];
  past: Appointment[];
  busyId: string | null;
  renderCard: (appointment: Appointment, options: { isUpcoming: boolean; busy: boolean }) => React.ReactNode;
};

export default function AppointmentsFeatureLayout({
  loading,
  timezoneLoading,
  error,
  timezoneError,
  businessTimezone,
  upcoming,
  past,
  busyId,
  renderCard,
}: Props) {
  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl space-y-8">
        <h1 className="text-3xl font-heading font-bold text-black">I miei appuntamenti</h1>

        {(loading || timezoneLoading) && (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
            Caricamento…
          </div>
        )}

        {(error || timezoneError) && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
            {error ?? timezoneError}
          </div>
        )}

        {!loading && !timezoneLoading && !error && !timezoneError && businessTimezone && (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-heading font-semibold text-black">Prossimi</h2>
              {upcoming.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessun appuntamento futuro.</p>
              ) : (
                upcoming.map((appointment) =>
                  renderCard(appointment, {
                    isUpcoming: true,
                    busy: busyId === appointment.id,
                  })
                )
              )}
            </section>

            <section className="space-y-4 pb-10">
              <h2 className="text-xl font-heading font-semibold text-black">Passati</h2>
              {past.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessun appuntamento passato.</p>
              ) : (
                past.map((appointment) =>
                  renderCard(appointment, {
                    isUpcoming: false,
                    busy: false,
                  })
                )
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
