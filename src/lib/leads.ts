// src/lib/leads.ts
import { supabase } from './supabaseClient';

export type NewLead = {
  business_id: string;
  name: string;
  email?: string | null;
  request?: string | null;
  channel: string;
  section?: string | null;
  phone_prefix?: string | null;
  phone_number_raw?: string | null;
};

export async function createLead(payload: NewLead) {
  const { error } = await supabase
    .from('leads')
    .insert([{
      business_id: payload.business_id,
      name: payload.name,
      email: payload.email ?? null,
      request: payload.request ?? null,
      channel: payload.channel,
      section: payload.section ?? null,
      phone_prefix: payload.phone_prefix ?? null,
      phone_number_raw: payload.phone_number_raw ?? null,
    }]);

  if (error) throw error;
  return true;
}