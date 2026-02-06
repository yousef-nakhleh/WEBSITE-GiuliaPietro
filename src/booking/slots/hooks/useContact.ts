// src/booking/slots/hooks/useContact.ts
import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Contact {
  id: string;
  profile_id: string;
  business_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_prefix: string | null;
  phone_number_raw: string | null;
  phone_number_e164: string | null;
  birthdate: string | null;
}

interface ContactData {
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  birthdate: string;
}

interface CustomerData {
  name: string;
  phone: string;
  email: string;
  birthdate: string;
}

interface UseContactOptions {
  supabaseClient: SupabaseClient;
  userId: string | null;
  userEmail: string | null;
  businessId: string;
  defaultPhonePrefix?: string;
}

interface UseContactReturn {
  contact: Contact | null;
  contactData: ContactData;
  customerData: CustomerData;
  setContactData: (data: ContactData | ((prev: ContactData) => ContactData)) => void;
  loading: boolean;
}

export const useContact = ({
  supabaseClient,
  userId,
  userEmail,
  businessId,
  defaultPhonePrefix = '+39',
}: UseContactOptions): UseContactReturn => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactRefreshTick, setContactRefreshTick] = useState(0);

  const [contactData, setContactData] = useState<ContactData>({
    firstName: '',
    lastName: '',
    phonePrefix: defaultPhonePrefix,
    phoneNumber: '',
    birthdate: '',
  });

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    birthdate: '',
  });

  const loadContact = async (uid: string) => {
    setLoading(true);
    
    const { data, error } = await supabaseClient
      .from('contacts')
      .select('id, profile_id, business_id, first_name, last_name, phone_prefix, phone_number_raw, phone_number_e164, birthdate')
      .eq('profile_id', uid)
      .eq('business_id', businessId)
      .maybeSingle();

    if (!error && data) {
      setContact(data as Contact);
      
      const fullPhone =
        (data?.phone_prefix && data?.phone_number_raw)
          ? `${data.phone_prefix} ${data.phone_number_raw}`
          : (data?.phone_number_e164 || '');

      setCustomerData({
        name: [data?.first_name, data?.last_name].filter(Boolean).join(' ') || '',
        phone: fullPhone || '',
        email: userEmail || '',
        birthdate: data?.birthdate || '',
      });

      setContactData({
        firstName: data?.first_name || '',
        lastName: data?.last_name || '',
        phonePrefix: data?.phone_prefix || defaultPhonePrefix,
        phoneNumber: data?.phone_number_raw || '',
        birthdate: data?.birthdate || '',
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadContact(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, contactRefreshTick, businessId]);

  // Listen for contact updates
  useEffect(() => {
    const handler = () => setContactRefreshTick(t => t + 1);
    window.addEventListener('contact:updated', handler);
    return () => window.removeEventListener('contact:updated', handler);
  }, []);

  return {
    contact,
    contactData,
    customerData,
    setContactData,
    loading,
  };
};