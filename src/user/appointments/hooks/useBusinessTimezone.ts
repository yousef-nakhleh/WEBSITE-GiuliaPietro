import { useEffect, useState } from 'react';
import type { TimezoneGateway } from '../api/gateways';

export function useBusinessTimezone({
  userId,
  businessId,
  timezoneGateway,
}: {
  userId: string | null | undefined;
  businessId: string;
  timezoneGateway: TimezoneGateway;
}) {
  const [businessTimezone, setBusinessTimezone] = useState<string | null>(null);
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [timezoneError, setTimezoneError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTimezone = async () => {
      if (!userId) {
        setBusinessTimezone(null);
        setTimezoneLoading(false);
        setTimezoneError(null);
        return;
      }

      setTimezoneLoading(true);
      setTimezoneError(null);

      const { timezone, error } = await timezoneGateway.getBusinessTimezone(businessId);

      if (cancelled) return;

      if (error) {
        console.error('Failed to load business timezone', error);
        setTimezoneError("Impossibile caricare il fuso orario dell'attività.");
        setBusinessTimezone(null);
      } else if (timezone) {
        setBusinessTimezone(timezone);
      } else {
        setTimezoneError("Fuso orario dell'attività non configurato.");
        setBusinessTimezone(null);
      }

      setTimezoneLoading(false);
    };

    loadTimezone();

    return () => {
      cancelled = true;
    };
  }, [businessId, timezoneGateway, userId]);

  return { businessTimezone, timezoneLoading, timezoneError };
}
