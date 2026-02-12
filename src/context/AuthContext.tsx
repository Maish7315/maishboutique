import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  county?: string;
  town?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
  checkEmailExists: (email: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rate limit - minimum time between signups (30 seconds)
const SIGNUP_COOLDOWN = 30000;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSignUpTime, setLastSignUpTime] = useState(0);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || '',
            phone: profile?.phone || '',
            avatarUrl: profile?.avatar_url || '',
            county: profile?.county || '',
            town: profile?.town || '',
            address: profile?.address || '',
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
          avatarUrl: profile?.avatar_url || '',
          county: profile?.county || '',
          town: profile?.town || '',
          address: profile?.address || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    const now = Date.now();
    
    // Check rate limit
    if (now - lastSignUpTime < SIGNUP_COOLDOWN) {
      const remainingSeconds = Math.ceil((SIGNUP_COOLDOWN - (now - lastSignUpTime)) / 1000);
      const error = new Error(`Too many signup attempts. Please wait ${remainingSeconds} seconds before trying again.`);
      toast.error(error.message);
      return { error };
    }

    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          const rateLimitError = new Error('Too many signup attempts. Please wait a few minutes before trying again.');
          toast.error(rateLimitError.message);
          return { error: rateLimitError };
        }
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Step 2: Create profile with upsert (insert or update)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email.toLowerCase(),
            full_name: fullName,
            phone: phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Account created but profile failed to save');
        } else {
          console.log('Profile created successfully:', email);
        }

        setLastSignUpTime(now);
        toast.success('Account created successfully! Welcome to Maish Fashion.');
      }

      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          const rateLimitError = new Error('Too many login attempts. Please wait a few minutes before trying again.');
          toast.error(rateLimitError.message);
          return { error: rateLimitError };
        }
        toast.error(error.message);
        return { error };
      }

      toast.success('Welcome back!');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      const error = new Error('No user logged in');
      toast.error(error.message);
      return { error };
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          county: data.county,
          town: data.town,
          address: data.address,
          avatar_url: data.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        toast.error(updateError.message);
        return { error: updateError };
      }

      // Refresh user data
      await refreshUser();
      
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error };
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
          avatarUrl: profile?.avatar_url || '',
          county: profile?.county || '',
          town: profile?.town || '',
          address: profile?.address || '',
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      return !!data;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      checkEmailExists,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
