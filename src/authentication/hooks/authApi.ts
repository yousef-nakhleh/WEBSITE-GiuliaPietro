import type { SupabaseClient } from "@supabase/supabase-js";

export type EmailCheckResult = { exists: boolean; hasPassword: boolean };

export const checkUserEmail = async (email: string): Promise<EmailCheckResult> => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-user-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!res.ok) {
    throw new Error("Impossibile verificare l'email");
  }

  const data = await res.json();
  return data as EmailCheckResult;
};

export const sendOtp = async (
  supabaseClient: SupabaseClient,
  email: string,
  shouldCreateUser: boolean
) =>
  supabaseClient.auth.signInWithOtp({
    email,
    options: { shouldCreateUser },
  });

export const signInWithPassword = async (
  supabaseClient: SupabaseClient,
  email: string,
  password: string
) => supabaseClient.auth.signInWithPassword({ email, password });

export const getUser = async (supabaseClient: SupabaseClient) => supabaseClient.auth.getUser();

export const updateUser = async (
  supabaseClient: SupabaseClient,
  payload: { password?: string; data?: Record<string, unknown> }
) => supabaseClient.auth.updateUser(payload);
