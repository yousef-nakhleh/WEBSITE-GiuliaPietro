export type Appointment = {
  id: string;
  business_id: string;
  barber_id: string | null;
  profile_id: string;
  appointment_date: string;
  appointment_status: 'pending' | 'confirmed' | 'cancelled' | string;
  duration_min: number | null;
  appointment_services?: Array<{
    id: string;
    service_id: string;
    duration_minutes: number;
    notes: string | null;
    services?: { name: string } | null;
  }>;
  barbers?: { name: string } | null;
};

export type Slot = { label: string; value: string };
