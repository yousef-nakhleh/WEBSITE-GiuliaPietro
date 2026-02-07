// src/booking/slots/SelectTimeSlot.tsx
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useSlots } from './hooks/useSlots';
import useMinuteAlignedTick from './hooks/useMinuteAlignedTick';
import { useBooking } from './hooks/useBooking';
import { useContact } from './hooks/useContact';
import { useConsent } from './hooks/useConsent';
import { useContactValidation, validateContactData } from './contact/useContactValidation';
import { DateSelector } from './layout/DateSelector';
import { TimeSlotGrid } from './layout/TimeSlotGrid';
import { NextAvailableDateButton } from './layout/NextAvailableDateButton';
import { AlternativeStaffButton } from './layout/AlternativeStaffButton';
import { SlotsRefreshWarning } from './layout/SlotsRefreshWarning';
import { localToUTCISO } from './logic/timeUtils';
import { verifySlotViaEdgeFunction } from './logic/slotVerification';
import { safeJSONParse } from './utils/safeJSON';
import { bookingStorage } from '../../utils/bookingStorage';

interface Service {
  id: string;
  name: string;
  price_cents: number;
  duration_min: number;
}

interface Barber {
  id: string;
  name: string;
}

interface SEOProps {
  title: string;
  canonical: string;
  description: string;
}

interface PageText {
  mainHeading: string;
  dateSelectionTitle: string;
  loadingMessage: string;
  serviceNotFound: string;
  loginPrompt: string;
  submittingText: string;
  confirmButtonText: string;
  requiredFieldsAlert: string;
  selectBarberAlert: string;
  slotUnavailableAfterLogin: string;
  slotUnavailableBeforeSubmit: string;
}

interface SelectTimeSlotProps {
  supabaseClient: SupabaseClient;
  businessId: string;
  successRoute: string;
  serviceSelectionRoute: string;
  staffSelectionRoute: string;
  edgeFunctionName: string;
  contactCheckFunctionName: string;
  createAppointmentRpcName: string;
  defaultTimezone: string;
  defaultPhonePrefix: string;
  SEOComponent: React.ComponentType<SEOProps>;
  LoginModalComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
  ContactPanelComponent: React.ComponentType<any>;
  SectionHeaderComponent: React.ComponentType<{ title: string }>;
  LoadingSpinnerComponent: React.ComponentType<{ message: string }>;
  useAuthHook: () => { user: any; profile: any };
  seoConfig: SEOProps;
  pageText: PageText;
}

const SelectTimeSlot = ({
  supabaseClient,
  businessId,
  successRoute,
  serviceSelectionRoute,
  staffSelectionRoute,
  edgeFunctionName,
  contactCheckFunctionName,
  createAppointmentRpcName,
  defaultTimezone,
  defaultPhonePrefix,
  SEOComponent,
  LoginModalComponent,
  ContactPanelComponent,
  SectionHeaderComponent,
  LoadingSpinnerComponent,
  useAuthHook,
  seoConfig,
  pageText,
}: SelectTimeSlotProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuthHook();
  const minuteTick = useMinuteAlignedTick();

  // Retrieve data from previous steps
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(() =>
    safeJSONParse<Barber | null>(bookingStorage.getItem('selectedBarber'), null)
  );
  const storedServiceIds = useMemo(
    () =>
      safeJSONParse<string[] | null>(bookingStorage.getItem('selectedServiceIds'), null),
    []
  );
  const storedServiceId = useMemo(() => bookingStorage.getItem('selectedServiceId'), []);

  // States
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [businessTimezone, setBusinessTimezone] = useState<string>(defaultTimezone);
  const [slotRefreshWarning, setSlotRefreshWarning] = useState('');
  const serviceIds = useMemo(() => services.map((service) => service.id), [services]);

  // Hooks
  const { contact, contactData, setContactData } = useContact({
    supabaseClient,
    userId: user?.id || null,
    userEmail: user?.email || null,
    businessId,
    defaultPhonePrefix,
  });
  const { errors, touchedFields, handleBlur, validateForm } =
    useContactValidation(contactData);

  const { consentState, setConsentState } = useConsent({
    supabaseClient,
    contactId: contact?.id ?? null,
    businessId,
  });

  const { perfectSlots, otherSlots, refetch: refetchSlots } = useSlots({
    supabaseClient,
    businessId,
    barberId: selectedBarber?.id || null,
    serviceIds,
    date,
    businessTimezone,
    edgeFunctionName,
    minuteTick,
  });

  const { submitBooking, submitting } = useBooking({
    supabaseClient,
    businessId,
    businessTimezone,
    localToUTCISO,
    contactCheckFunctionName,
    createAppointmentRpcName,
  });

  // Fetch business timezone
  useEffect(() => {
    const loadTz = async () => {
      const { data, error } = await supabaseClient
        .from('business')
        .select('timezone')
        .eq('id', businessId)
        .maybeSingle();
      if (!error && data?.timezone) setBusinessTimezone(data.timezone as string);
    };
    loadTz();
  }, [supabaseClient, businessId]);

  // Fetch service data
  useEffect(() => {
    const requestedIds =
      storedServiceIds && storedServiceIds.length > 0
        ? storedServiceIds
        : storedServiceId
          ? [storedServiceId]
          : [];

    if (requestedIds.length === 0) {
      navigate(serviceSelectionRoute);
      return;
    }

    const fetchServices = async () => {
      const { data, error } = await supabaseClient
        .from('services')
        .select('id, name, price_cents, duration_min')
        .in('id', requestedIds);

      if (!error && data && data.length > 0) {
        const sorted = requestedIds
          .map((id) => data.find((service) => service.id === id))
          .filter(Boolean) as Service[];
        setServices(sorted);
      } else {
        console.error('Error fetching service:', error);
        navigate(serviceSelectionRoute);
      }
      setLoading(false);
    };

    fetchServices();
  }, [storedServiceId, storedServiceIds, navigate, serviceSelectionRoute, supabaseClient]);

  // Guard: redirect if no barber selected
  useEffect(() => {
    if (!selectedBarber) {
      navigate(staffSelectionRoute);
      return;
    }
  }, [selectedBarber, navigate, staffSelectionRoute]);

  // Restore state after login
  useEffect(() => {
    if (!user || services.length === 0) return;

    const savedTime = bookingStorage.getItem('selectedTime');
    const savedDate = bookingStorage.getItem('selectedDate');
    const savedBarber = safeJSONParse<Barber | null>(
      bookingStorage.getItem('selectedBarber'),
      null
    );

    if (savedDate) setDate(new Date(savedDate));
    if (savedTime) setSelectedTime(savedTime);
    setSelectedBarber(savedBarber);

    const maybeRecheck = async () => {
      if (!selectedTime) return;
      const dateStr = format(savedDate ? new Date(savedDate) : date, 'yyyy-MM-dd');
      const barberId = selectedBarber?.id;
      if (!barberId || services.length === 0) return;

      const ok = await verifySlotViaEdgeFunction({
        supabaseClient,
        businessId,
        barberId,
        dateStr,
        serviceIds,
        timeHHmm: selectedTime,
        edgeFunctionName,
      });

      if (!ok) {
        setSelectedTime('');
        bookingStorage.removeItem('selectedTime');
        setSlotRefreshWarning(pageText.slotUnavailableAfterLogin);
        refetchSlots();
      }
    };

    maybeRecheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!selectedTime) {
      setSlotRefreshWarning('');
      return;
    }

    const allSlots = [...perfectSlots, ...otherSlots];
    const stillExists = allSlots.some(slot => slot.value === selectedTime);

    if (!stillExists) {
      setSelectedTime('');
      bookingStorage.removeItem('selectedTime');
      setSlotRefreshWarning(
        "L'orario selezionato non è più disponibile. Seleziona un nuovo slot."
      );
    }
  }, [selectedTime, perfectSlots, otherSlots]);

  // Handle booking submission
  const handleSubmit = async () => {
    const hasCoreContactData =
      !!contactData.firstName.trim() &&
      !!contactData.lastName.trim() &&
      !!contactData.phonePrefix &&
      !!contactData.phoneNumber.trim();

    if (!selectedTime || services.length === 0 || !user || !hasCoreContactData) {
      alert(pageText.requiredFieldsAlert);
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!selectedBarber?.id) {
      alert(pageText.selectBarberAlert);
      return;
    }

    // Re-verify slot before submission
    const dateStr = format(date, 'yyyy-MM-dd');
    const stillFree = await verifySlotViaEdgeFunction({
      supabaseClient,
      businessId,
      barberId: selectedBarber.id,
      dateStr,
      serviceIds,
      timeHHmm: selectedTime,
      edgeFunctionName,
    });

    if (!stillFree) {
      setSelectedTime('');
      bookingStorage.removeItem('selectedTime');
      setSlotRefreshWarning(pageText.slotUnavailableBeforeSubmit);
      refetchSlots();
      return;
    }

    const idempotencyKey = crypto.randomUUID();
    const success = await submitBooking({
      date,
      selectedTime,
      services,
      barberId: selectedBarber.id,
      userId: user.id,
      userEmail: user.email || '',
      contactData: {
        ...contactData,
        smsConsent: consentState.smsConsent,
        emailMarketingConsent: consentState.emailMarketingConsent,
      },
      idempotencyKey,
      profileBirthdate: (profile as any)?.birthdate || null,
    });

    if (success) {
      navigate(successRoute);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="pt-24">
        <LoadingSpinnerComponent message={pageText.loadingMessage} />
      </main>
    );
  }

  // Service not found
  if (services.length === 0) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 font-primary">{pageText.serviceNotFound}</p>
      </main>
    );
  }

  const isLoggedIn = !!user;

  const handleOpenLogin = () => {
    bookingStorage.setItem('selectedDate', format(date, 'yyyy-MM-dd'));
    bookingStorage.setItem('selectedTime', selectedTime);
    bookingStorage.setItem('selectedBarber', JSON.stringify(selectedBarber));
    if (services[0]?.id) bookingStorage.setItem('selectedServiceId', services[0].id);
    if (services.length > 0) {
      bookingStorage.setItem('selectedServiceIds', JSON.stringify(services.map((item) => item.id)));
      bookingStorage.setItem('selectedServices', JSON.stringify(services));
    }
    setLoginOpen(true);
  };

  // Contact completeness for CTA
  const hasCoreContact =
    !!contactData.firstName.trim() &&
    !!contactData.lastName.trim() &&
    !!contactData.phonePrefix &&
    !!contactData.phoneNumber.trim();
  const contactErrors = validateContactData(contactData);
  const isContactValid = Object.keys(contactErrors).length === 0;
  const canSubmit =
    !!selectedTime && !submitting && isLoggedIn && hasCoreContact && isContactValid;

  const noSlotsAvailable = perfectSlots.length === 0 && otherSlots.length === 0;

  return (
    <main className="pt-24 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/assets/images/background.png)' }}>
      <SEOComponent {...seoConfig} />

      <LoginModalComponent isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Hero */}
      <section className="pt-4 pb-4">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-black">
            {pageText.mainHeading}
          </h1>
        </div>
      </section>

      {/* Date and Time Selection */}
      <section className="pb-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-3">
          <SectionHeaderComponent title={pageText.dateSelectionTitle} />

          <DateSelector selected={date} onChange={setDate} />

          {/* Time Slots */}
          <TimeSlotGrid
            perfectSlots={perfectSlots}
            otherSlots={otherSlots}
            selectedTime={selectedTime}
            onSlotSelect={setSelectedTime}
          />
          {slotRefreshWarning && (
            <SlotsRefreshWarning
              message={slotRefreshWarning}
              onDismiss={() => setSlotRefreshWarning('')}
              dismissText="OK"
            />
          )}

          {/* Alternative Staff & Next Available Day Buttons */}
          {selectedBarber && (
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <AlternativeStaffButton
                supabaseClient={supabaseClient}
                businessId={businessId}
                currentDate={date}
                serviceIds={serviceIds}
                currentStaffId={selectedBarber.id}
                edgeFunctionName={edgeFunctionName}
                onStaffChange={(newStaff) => {
                  setSelectedTime('');
                  bookingStorage.removeItem('selectedTime');
                  setSelectedBarber(newStaff);
                }}
              />
              {noSlotsAvailable && (
                <NextAvailableDateButton
                  supabaseClient={supabaseClient}
                  businessId={businessId}
                  currentDate={date}
                  setDate={setDate}
                  serviceIds={serviceIds}
                  barberId={selectedBarber.id}
                  edgeFunctionName={edgeFunctionName}
                  maxDaysToCheck={30}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Panel */}
      <ContactPanelComponent
        isLoggedIn={isLoggedIn}
        contact={contact}
        user={user}
        contactData={contactData}
        onContactDataChange={(data: any) => setContactData(prev => ({ ...prev, ...data }))}
        onOpenLogin={handleOpenLogin}
        consentState={consentState}
        onConsentChange={setConsentState}
        validation={{
          errors,
          touchedFields,
          onBlur: handleBlur,
        }}
      />

      {/* Submit Button */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-[#E8E0D5] border border-black text-black px-8 py-4 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  {pageText.submittingText}
                </span>
              ) : (
                pageText.confirmButtonText
              )}
            </button>
            {!selectedTime && (
              <p className="mt-3 text-sm text-gray-600 font-primary">
                Seleziona un orario per continuare.
              </p>
            )}
            {!!selectedTime && !isContactValid && (
              <p className="mt-3 text-sm text-red-600 font-primary">
                Completa correttamente i dati richiesti per continuare.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectTimeSlot;
 
