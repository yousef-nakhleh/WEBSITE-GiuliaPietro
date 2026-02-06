// src/booking/slots/hooks/useBooking.ts
import { useState } from 'react';
import { format } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';
import { bookingStorage } from '../../../utils/bookingStorage';

interface Service {
  id: string;
  name: string;
  price_cents: number;
  duration_min: number;
}

interface ContactData {
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  birthdate: string;
  smsConsent?: boolean;
  emailMarketingConsent?: boolean;
}

interface UseBookingOptions {
  supabaseClient: SupabaseClient;
  businessId: string;
  businessTimezone: string;
  localToUTCISO: (dateStr: string, timeStr: string, timezone: string) => string | null;
  contactCheckFunctionName: string;
  createAppointmentRpcName: string;
}

interface UseBookingReturn {
  submitBooking: (params: {
    date: Date;
    selectedTime: string;
    services: Service[];
    barberId: string;
    userId: string;
    userEmail: string;
    contactData: ContactData;
    idempotencyKey: string;
    profileBirthdate: string | null;
  }) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
}

export const useBooking = ({
  supabaseClient,
  businessId,
  businessTimezone,
  localToUTCISO,
  contactCheckFunctionName,
  createAppointmentRpcName,
}: UseBookingOptions): UseBookingReturn => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = async ({
    date,
    selectedTime,
    services,
    barberId,
    userId,
    userEmail,
    contactData,
    idempotencyKey,
    profileBirthdate,
  }: {
    date: Date;
    selectedTime: string;
    services: Service[];
    barberId: string;
    userId: string;
    userEmail: string;
    contactData: ContactData;
    idempotencyKey: string;
    profileBirthdate: string | null;
  }): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');

      // Contact check via edge function
      const { data: contactCheckData, error: contactCheckError } =
        await supabaseClient.functions.invoke(contactCheckFunctionName, {
          body: {
            business_id: businessId,
            profile_id: userId,
            email: userEmail,
            first_name: contactData.firstName.trim(),
            last_name: contactData.lastName.trim(),
            phone_prefix: contactData.phonePrefix,
            phone_number_raw: contactData.phoneNumber.trim(),
            birthdate: contactData.birthdate || null,
            sms_transactional_opt_in: contactData.smsConsent ?? false,
            email_marketing_opt_in: contactData.emailMarketingConsent ?? false,
          },
        });

      if (contactCheckError) {
        console.error('contact-check error:', contactCheckError);
        setError('Errore durante la verifica del contatto');
        return false;
      }

      const contactId = contactCheckData?.contact_id;
      if (!contactId) {
        console.error('No contact_id returned from contact-check');
        setError('Errore durante la creazione del contatto');
        return false;
      }

      // Update profile birthdate only if it's currently empty
      if (contactData.birthdate && !profileBirthdate) {
        await supabaseClient
          .from('profiles')
          .update({ birthdate: contactData.birthdate })
          .eq('id', userId);
      }

      const appointment_date = localToUTCISO(dateStr, selectedTime, businessTimezone);

      if (!appointment_date) {
        setError('Errore nella conversione della data');
        return false;
      }

      if (services.length === 0) {
        setError('Seleziona almeno un servizio');
        return false;
      }

      const serviceIds = services.map((serviceItem) => serviceItem.id);
      const serviceDurations = services.map((serviceItem) => serviceItem.duration_min);

      const rpcPayload = {
        p_business_id: businessId,
        p_barber_id: barberId,
        p_appointment_date: appointment_date,
        p_contact_id: contactId,
        p_profile_id: userId,
        p_service_ids: serviceIds,
        p_duration_minutes: serviceDurations,
        p_appointment_status: 'confirmed',
        p_waiting_list_id: null,
        p_allow_override: false,
        p_idempotency_key: idempotencyKey,
        p_source_channel: 'website',
      };

      const { data: appointmentData, error: rpcError } = await supabaseClient.rpc(
        createAppointmentRpcName,
        rpcPayload
      );

      if (rpcError) {
        console.error('create_appointment RPC error:', rpcError);
        setError("Errore durante la creazione dell'appuntamento");
        return false;
      }

      const appointmentId =
        typeof appointmentData === 'string'
          ? appointmentData
          : Array.isArray(appointmentData)
            ? appointmentData[0]?.appointment_id ?? appointmentData[0]?.id
            : appointmentData?.appointment_id ?? appointmentData?.id;

      if (!appointmentId) {
        console.error('No appointment id returned:', appointmentData);
        setError("Errore durante la creazione dell'appuntamento");
        return false;
      }

      // Dispatch contact update event
      window.dispatchEvent(new CustomEvent('contact:updated'));

      // Save to sessionStorage
      const fullName = `${contactData.firstName} ${contactData.lastName}`.trim();
      bookingStorage.setItem('customerName', fullName);
      bookingStorage.setItem('selectedTime', selectedTime);
      bookingStorage.setItem('selectedDate', dateStr);
      bookingStorage.setItem('selectedServices', JSON.stringify(services));

      return true;
    } catch (err) {
      console.error('Error during booking:', err);
      setError('Errore durante la prenotazione');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitBooking,
    submitting,
    error,
  };
};
