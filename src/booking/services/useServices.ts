// src/booking/services/useServices.ts
import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price_cents?: number | null;
  duration_min?: number | null;
  category?: string | null;
}

interface UseServicesOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
}

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export const useServices = ({
  supabaseClient,
  businessId,
}: UseServicesOptions): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .eq('active', true);

      if (fetchError) {
        setError(fetchError.message);
        setServices([]);
      } else if (data) {
        setServices(data as Service[]);
      }

      setLoading(false);
    };

    fetchServices();
  }, [supabaseClient, businessId]);

  return {
    services,
    loading,
    error,
  };
};
