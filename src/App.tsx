import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './authentication/context/AuthContext';
import { supabase } from './lib/supabaseClient';
import { BUSINESS_ID } from './config/business'; // ✅ ADD THIS
import { Helmet } from 'react-helmet-async';
import useMinuteAlignedTick from './booking/slots/hooks/useMinuteAlignedTick';
import { bookingStorage } from './utils/bookingStorage';

import Navbar from './components/static/Navbar';
import Footer from './components/static/Footer';
import CookieBanner from './cookies/CookieBanner';
import AnalyticsLoader from './cookies/AnalyticsLoader';

// Pages
import Home from './pages/Home';
import PrivacyPolicy from './legal/PrivacyPolicy';

// Booking Flow
import SelectService from './booking/services/SelectService';
import SelectStaff from './booking/staff/SelectStaff';
import SelectTimeSlot from './booking/slots/SelectTimeSlot';
import BookingSuccess from './booking/success/BookingSuccess';
import AppointmentsFeature from './user/appointments/AppointmentsFeature';
import {
  createSupabaseAppointmentsGateway,
  createSupabaseSlotsGateway,
  createSupabaseTimezoneGateway,
} from './user/appointments/api/gateways';

// Shared UI Components
import SEO from './seo/SEO';
import { SectionHeader } from './booking/UI/SectionHeader';
import { LoadingSpinner } from './booking/UI/LoadingSpinner';
import { ContactPanel } from './booking/slots/contact/ContactPanel';
import LoginModal from './authentication/UI/LoginModal';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ===== AUTHENTICATION CONFIG =====
const authConfig = {
  supabaseClient: supabase,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  checkEmailFunctionName: 'check-user-email',
  profileTableName: 'profiles',
  refreshBufferMs: 60000,
};





const bookingFlowConfig = {
  supabaseClient: supabase,
  businessId: BUSINESS_ID,
  defaultTimezone: 'Europe/Rome',
  defaultPhonePrefix: '+39',
  edgeFunctionName: 'dynamic-slots-services-array', 
  contactCheckFunctionName: 'contact-check',
  createAppointmentRpcName: 'create_appointment',
  routes: {
    home: '/',
    service: '/prenotazione/servizi',
    staff: '/prenotazione/staff',
    slot: '/prenotazione/orari',
    success: '/prenotazione/successo',
  },
};

const appointmentsConfig = {
  route: '/user/appuntamenti',
  slotsEdgeFunctionName: bookingFlowConfig.edgeFunctionName,
};

const appointmentsGateway = createSupabaseAppointmentsGateway(supabase);
const slotsGateway = createSupabaseSlotsGateway(supabase, {
  edgeFunctionName: appointmentsConfig.slotsEdgeFunctionName,
});
const timezoneGateway = createSupabaseTimezoneGateway(supabase);

// Service Selection Config
const serviceConfig = {
  seoConfig: {
    title: "Scegli un servizio | Giulia & Pietro Acconciature Unisex",
    canonical: "https://epifaniodigiovanni.it/prenotazione/servizi",
    description: "Seleziona il servizio che vuoi prenotare.",
  },
  schemaConfig: {
    businessName: "Giulia & Pietro Acconciature Unisex",
    businessType: "ProfessionalService",
    locality: "Caravaggio",
    country: "IT",
  },
  pageText: {
    mainHeading: "Scegli uno/più servizi",
    sectionTitle: "Tutti i servizi",
    loadingMessage: "Caricamento servizi…",
    errorPrefix: "Errore",
  },
};

// Staff Selection Config
const staffConfig = {
  seoConfig: {
    title: "Scegli lo staff | Giulia & Pietro Acconciature Unisex",
    canonical: "https://epifaniodigiovanni.it/prenotazione/staff",
    description: "Seleziona il membro dello staff preferito.",
  },
  pageText: {
    mainHeading: "Scegli il membro dello staff",
    sectionTitle: "Il nostro team",
    loadingMessage: "Caricamento staff…",
    errorPrefix: "Errore",
  },
};

// Time Slot Selection Config
const slotConfig = {
  seoConfig: {
    title: "Scegli data e orario | Giulia & Pietro Acconciature Unisex",
    canonical: "https://epifaniodigiovanni.it/prenotazione/orari",
    description: "Seleziona la data e l'orario preferiti.",
  },
  pageText: {
    mainHeading: "Completa la prenotazione",
    dateSelectionTitle: "Seleziona una data",
    loadingMessage: "Caricamento…",
    serviceNotFound: "Servizio non trovato",
    loginPrompt: "Accedi per completare la prenotazione",
    submittingText: "Prenotazione in corso...",
    confirmButtonText: "CONFERMA PRENOTAZIONE",
    requiredFieldsAlert: "Compila tutti i campi richiesti ed effettua l'accesso per prenotare.",
    selectBarberAlert: "Seleziona un membro dello staff.",
    slotUnavailableAfterLogin: "L'orario selezionato non è più disponibile. Scegli un altro.",
    slotUnavailableBeforeSubmit: "L'orario selezionato non è più disponibile. Riprova.",
  },
};

// Booking Success Config
const successConfig = {
  seoConfig: {
    title: "Prenotazione confermata",
    description: "La tua prenotazione è stata confermata con successo!",
    noindex: true,
  },
  pageText: {
    successHeading: "PRENOTAZIONE CONFERMATA!",
    thankYouMessage: "Grazie {name}, la tua prenotazione è stata confermata. Riceverai a breve un'email di conferma.",
    detailsHeading: "Dettagli appuntamento",
    dateLabel: "Data",
    staffLabel: "Staff",
    timeLabel: "Orario",
    serviceLabel: "Servizio",
    anyStaffText: "Primo collaboratore disponibile",
    nextStepsHeading: "E adesso?",
    nextStepsDescription: "La tua prenotazione è confermata. Puoi tornare alla home o contattarci.",
    homeButtonText: "TORNA ALLA HOME",
    callButtonText: "CHIAMACI",
  },
  phoneNumber: "3339347932",
  dateLocale: "it-IT",
};

function InnerApp() {
  const hasSelectedService = () => {
    const storedServiceIds = bookingStorage.getItem('selectedServiceIds');
    const storedServiceId = bookingStorage.getItem('selectedServiceId');
    return !!(storedServiceIds || storedServiceId);
  };

  const hasSelectedBarber = () => {
    const storedBarber = bookingStorage.getItem('selectedBarber');
    return !!storedBarber;
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="font-roboto">
        <Navbar />
        <AnalyticsLoader />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Booking Flow Routes */}
            <Route
              path="/prenotazione/servizi"
              element={
                <SelectService
                  supabaseClient={bookingFlowConfig.supabaseClient}
                  businessId={bookingFlowConfig.businessId}
                  staffSelectionRoute={bookingFlowConfig.routes.staff}
                  SEOComponent={SEO}
                  HelmetComponent={Helmet}
                  seoConfig={serviceConfig.seoConfig}
                  schemaConfig={serviceConfig.schemaConfig}
                  pageText={serviceConfig.pageText}
                />
              }
            />

            <Route
              path="/prenotazione/staff"
              element={
                hasSelectedService() ? (
                  <SelectStaff
                    supabaseClient={bookingFlowConfig.supabaseClient}
                    businessId={bookingFlowConfig.businessId}
                    slotSelectionRoute={bookingFlowConfig.routes.slot}
                    SEOComponent={SEO}
                    seoConfig={staffConfig.seoConfig}
                    pageText={staffConfig.pageText}
                  />
                ) : (
                  <Navigate to={bookingFlowConfig.routes.service} replace />
                )
              }
            />

            <Route
              path="/prenotazione/orari"
              element={
                hasSelectedService() && hasSelectedBarber() ? (
                  <SelectTimeSlot
                    supabaseClient={bookingFlowConfig.supabaseClient}
                    businessId={bookingFlowConfig.businessId}
                    successRoute={bookingFlowConfig.routes.success}
                    serviceSelectionRoute={bookingFlowConfig.routes.service}
                    staffSelectionRoute={bookingFlowConfig.routes.staff}
                    edgeFunctionName={bookingFlowConfig.edgeFunctionName}
                    contactCheckFunctionName={bookingFlowConfig.contactCheckFunctionName}
                    createAppointmentRpcName={bookingFlowConfig.createAppointmentRpcName}
                    defaultTimezone={bookingFlowConfig.defaultTimezone}
                    defaultPhonePrefix={bookingFlowConfig.defaultPhonePrefix}
                    SEOComponent={SEO}
                    LoginModalComponent={LoginModal}
                    ContactPanelComponent={ContactPanel}
                    SectionHeaderComponent={SectionHeader}
                    LoadingSpinnerComponent={LoadingSpinner}
                    useAuthHook={useAuth}
                    seoConfig={slotConfig.seoConfig}
                    pageText={slotConfig.pageText}
                  />
                ) : (
                  <Navigate
                    to={
                      hasSelectedService()
                        ? bookingFlowConfig.routes.staff
                        : bookingFlowConfig.routes.service
                    }
                    replace
                  />
                )
              }
            />

            <Route
              path="/prenotazione/successo"
              element={
                <BookingSuccess
                  SEOComponent={SEO}
                  seoConfig={successConfig.seoConfig}
                  pageText={successConfig.pageText}
                  homeRoute={bookingFlowConfig.routes.home}
                  phoneNumber={successConfig.phoneNumber}
                  dateLocale={successConfig.dateLocale}
                />
              }
            />

            <Route
              path={appointmentsConfig.route}
              element={
                <AppointmentsFeature
                  businessId={bookingFlowConfig.businessId}
                  appointmentsGateway={appointmentsGateway}
                  slotsGateway={slotsGateway}
                  timezoneGateway={timezoneGateway}
                  useAuthHook={useAuth}
                  useMinuteAlignedTickHook={useMinuteAlignedTick}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider 
      supabaseClient={authConfig.supabaseClient}
      profileTableName={authConfig.profileTableName}
      refreshBufferMs={authConfig.refreshBufferMs}
    >
      <InnerApp />
    </AuthProvider>
  );
}
