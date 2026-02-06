// src/booking/staff/SelectStaff.tsx
import { useNavigate } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useStaff } from './useStaff';
import { StaffList } from './StaffList';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface SEOProps {
  title: string;
  canonical: string;
  description: string;
}

interface PageText {
  mainHeading: string;
  sectionTitle: string;
  loadingMessage: string;
  errorPrefix: string;
}

interface SelectStaffProps {
  supabaseClient: SupabaseClient;
  businessId: string;
  slotSelectionRoute: string;
  SEOComponent: React.ComponentType<SEOProps>;
  seoConfig: SEOProps;
  pageText: PageText;
}

const SelectStaff = ({
  supabaseClient,
  businessId,
  slotSelectionRoute,
  SEOComponent,
  seoConfig,
  pageText,
}: SelectStaffProps) => {
  const navigate = useNavigate();

  const { staff, loading, error, selectStaff } = useStaff({
    supabaseClient,
    businessId,
    onStaffSelect: () => {
      navigate(slotSelectionRoute);
    },
  });

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

      {/* Hero */}
      <section className="pt-4 pb-3">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-black">
            {pageText.mainHeading}
          </h1>
        </div>
      </section>

      {/* Staff List */}
      <section className="flex-1 flex flex-col pb-4">
        <div className="px-4 sm:px-6 lg:px-12 flex-1 flex flex-col">
          <div className="mt-3 sm:mt-5">
            <StaffList staff={staff} onStaffSelect={selectStaff} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectStaff;