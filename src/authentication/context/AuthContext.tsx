import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number_raw: string | null;
  phone_prefix: string | null;
  phone_number_e164: string | null;
  avatar_url: string | null;
  business_id: string | null;
  birthdate: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isRecoveringPassword: boolean;
  requiresPasswordSetup: boolean;
  supabaseClient: SupabaseClient;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  supabaseClient,
}: {
  children: React.ReactNode;
  supabaseClient: SupabaseClient;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(false);
  const mounted = useRef(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const clearSessionState = () => {
    clearRefreshTimer();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRequiresPasswordSetup(false);
  };

  // helper to fetch profile
  const loadProfile = async (uid: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select(
          'id, first_name, last_name, phone_number_raw, phone_prefix, phone_number_e164, avatar_url, business_id, birthdate'
        )
        .eq('id', uid)
        .single();

      if (error) {
        // PGRST116 = No rows found for single(); the trigger may not have created it yet.
        if ((error as any).code !== 'PGRST116') {
          console.error('❌ Error loading profile:', (error as any).message);
        }
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error('❌ Profile fetch failed:', err);
      setProfile(null);
    }
  };

  const scheduleTokenRefresh = (sess: Session | null) => {
    clearRefreshTimer();
    if (!sess?.expires_at) return;

    const expiresAtMs = sess.expires_at * 1000;
    const refreshBuffer = 60 * 1000; // refresh one minute before expiry
    const timeoutMs = Math.max(expiresAtMs - Date.now() - refreshBuffer, 0);

    refreshTimerRef.current = setTimeout(() => {
      refreshSession();
    }, timeoutMs);
  };

  const applySession = (sess: Session | null, options?: { asAuthenticated?: boolean }) => {
    if (!mounted.current) return;

    const shouldAuthenticate = options?.asAuthenticated ?? true;

    setSession(sess ?? null);
    setUser(shouldAuthenticate ? sess?.user ?? null : null);

    if (shouldAuthenticate && sess?.user?.id) {
      loadProfile(sess.user.id);

      const hasPassword = sess.user.user_metadata?.has_password === true;
      const pendingReset = sess.user.user_metadata?.pending_reset === true;
      
      // Show password setup if user has no password OR is in the middle of resetting
      setRequiresPasswordSetup(!hasPassword || pendingReset);
    } else {
      setProfile(null);
      setRequiresPasswordSetup(false);
    }

    scheduleTokenRefresh(sess ?? null);
  };

  useEffect(() => {
    mounted.current = true;
    (async () => {
      const { data } = await supabaseClient.auth.getSession();
      applySession(data.session ?? null);
      setLoading(false);
    })();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, sess) => {
      if (!mounted.current) return;

      switch (event) {
        case 'PASSWORD_RECOVERY':
          setIsRecoveringPassword(true);
          applySession(sess ?? null, { asAuthenticated: true });
          break;
        case 'SIGNED_IN':
          if (isRecoveringPassword) {
            setIsRecoveringPassword(false);
          }
          applySession(sess ?? null);
          break;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          applySession(sess ?? null);
          if (event === 'USER_UPDATED' && isRecoveringPassword) {
            setIsRecoveringPassword(false);
          }
          break;
        case 'SIGNED_OUT':
          setIsRecoveringPassword(false);
          clearSessionState();
          break;
        default:
          applySession(sess ?? null);
      }
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      clearRefreshTimer();
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('❌ signOut error:', error.message);
    } else {
      clearSessionState();
    }
    setLoading(false);
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabaseClient.auth.refreshSession();
      if (error || !data.session) {
        throw error ?? new Error('No session returned during refresh');
      }
      applySession(data.session);
    } catch (err) {
      console.error('❌ Session refresh failed:', err);
      clearSessionState();
      const { error } = await supabaseClient.auth.signOut();
      if (error) console.error('❌ signOut error:', error.message);
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      profile,
      signOut,
      refreshSession,
      isRecoveringPassword,
      requiresPasswordSetup,
      supabaseClient,
    }),
    [user, session, loading, profile, isRecoveringPassword, requiresPasswordSetup, supabaseClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
