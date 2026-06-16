import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string | null;
  phone: string | null;
  document: string | null;
  document_type: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  onboarding_step: string | null;
  onboarding_completed: boolean | null;
  trial_ends_at: string | null;
  guarantee_ends_at: string | null;
}

interface UserMetadata {
  first_name?: string;
  phone?: string;
  document?: string;
  document_type?: string;
  plan?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthResponse {
  error: AuthError | null;
  data?: unknown;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,
  });

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (session?.user) {
          // Defer profile fetch to avoid blocking
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            initialized: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true,
          });
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          session,
          profile,
          loading: false,
          initialized: true,
        });
      } else {
        setState(prev => ({ ...prev, loading: false, initialized: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    metadata: UserMetadata
  ): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: metadata,
        },
      });

      setState(prev => ({ ...prev, loading: false }));

      if (error) {
        return { error };
      }

      return { error: null, data };
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      return { error: err as AuthError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setState(prev => ({ ...prev, loading: false }));

      if (error) {
        return { error };
      }

      return { error: null, data };
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      return { error: err as AuthError };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: true,
    });
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshProfile,
    isAuthenticated: !!state.session,
  };
}
