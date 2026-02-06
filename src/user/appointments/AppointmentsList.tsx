import { supabase } from '../../lib/supabase';
import { BUSINESS_ID } from '../../config/business';
import { useAuth } from '../../context/AuthContext';
import useMinuteAlignedTick from '../../booking/slots/hooks/useMinuteAlignedTick';
import {
  createSupabaseAppointmentsGateway,
  createSupabaseSlotsGateway,
  createSupabaseTimezoneGateway,
} from './api/gateways';
import UserAppointments from './UserAppointments';

export default function AppointmentsList() {
  return (
    <UserAppointments
      businessId={BUSINESS_ID}
      appointmentsGateway={createSupabaseAppointmentsGateway(supabase)}
      slotsGateway={createSupabaseSlotsGateway(supabase)}
      timezoneGateway={createSupabaseTimezoneGateway(supabase)}
      useAuthHook={useAuth}
      useMinuteAlignedTickHook={useMinuteAlignedTick}
    />
  );
}
