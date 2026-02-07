// src/booking/services/SelectService.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useServices } from './useServices';
import { ServiceList } from './ServiceList';
import { SectionHeader } from '../UI/SectionHeader';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { bookingStorage } from '../../utils/bookingStorage';

interface SEOProps {
  title: string;
  canonical: string;
  description: string;
}

interface SchemaConfig {
  businessName: string;
  businessType: string;
  locality: string;
  country: string;
}

interface PageText {
  mainHeading: string;
  sectionTitle: string;
  loadingMessage: string;
  errorPrefix: string;
}

interface SelectServiceProps {
  supabaseClient: SupabaseClient;
  businessId: string;
  staffSelectionRoute: string;
  SEOComponent: React.ComponentType<SEOProps>;
  HelmetComponent: React.ComponentType<{ children: React.ReactNode }>;
  seoConfig: SEOProps;
  schemaConfig: SchemaConfig;
  pageText: PageText;
}

const SelectService = ({
  supabaseClient,
  businessId,
  staffSelectionRoute,
  SEOComponent,
  HelmetComponent,
  seoConfig,
  schemaConfig,
  pageText,
}: SelectServiceProps) => {
  const navigate = useNavigate();

  const { services, loading, error } = useServices({
    supabaseClient,
    businessId,
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const selectedServices = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(service.id)),
    [services, selectedServiceIds]
  );

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleConfirm = () => {
    if (selectedServiceIds.length === 0) return;
    bookingStorage.setItem('selectedServiceIds', JSON.stringify(selectedServiceIds));
    bookingStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    bookingStorage.setItem('selectedServiceId', selectedServiceIds[0]);
    navigate(staffSelectionRoute);
  };

  // Loading state
  if (loading) {
    return (
      <main className="pt-24">
        <LoadingSpinner message={pageText.loadingMessage} />
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 font-primary">
          {pageText.errorPrefix}: {error}
        </p>
      </main>
    );
  }

  return (
    <main
      className="pt-24 min-h-[calc(100svh-6rem)] bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: 'url(/assets/images/background.png)' }}
    >
      {/* SEO */}
      <SEOComponent {...seoConfig} />

      {/* JSON-LD for Services */}
      <HelmetComponent>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": services.map((service, index) => ({
              "@type": "Service",
              "position": index + 1,
              "name": service.name,
              "description": service.description || "",
              "offers": service.price_cents
                ? {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "price": (service.price_cents / 100).toFixed(2),
                  }
                : undefined,
              "provider": {
                "@type": schemaConfig.businessType,
                "name": schemaConfig.businessName,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": schemaConfig.locality,
                  "addressCountry": schemaConfig.country,
                },
              },
            })),
          })}
        </script>
      </HelmetComponent>

      {/* Hero */}
      <section className="pt-4 pb-3">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-black">
            {pageText.mainHeading}
          </h1>
        </div>
      </section>

      {/* Service List */}
      <section className="flex-1 flex flex-col pb-4">
        <div className="px-4 sm:px-6 lg:px-12 flex-1 flex flex-col">
          <div className="mt-3 sm:mt-5">
            <ServiceList
              services={services}
              selectedServiceIds={selectedServiceIds}
              onServiceToggle={toggleService}
            />
          </div>
          <div className="mt-auto text-center pt-4">
            <button
              onClick={handleConfirm}
              disabled={selectedServiceIds.length === 0}
              className="bg-[#E8E0D5] border border-black text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Conferma
            </button>
            <p className={`mt-2 text-sm text-gray-600 font-primary transition-opacity duration-300 ${
              selectedServiceIds.length === 0 ? 'opacity-100' : 'opacity-0'
            }`}>
              Seleziona almeno un servizio per continuare.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectService;
