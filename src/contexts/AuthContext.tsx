import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { createUser, getUser, updateUser, User } from '../services/database';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Create or update user profile when Supabase user changes
  useEffect(() => {
    if (user) {
      const createOrUpdateProfile = async () => {
        try {
          // Try to get existing user profile
          const existingProfile = await getUser(user.id);
          setUserProfile(existingProfile);
        } catch (error) {
          // If user doesn't exist or fetch failed, create new profile
          console.warn('Failed to fetch existing profile, attempting to create one.', error);
          try {
            const newProfile = await createUser({
              email: user.email || '',
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              phone: user.user_metadata?.phone || ''
            }, user.id);
            setUserProfile(newProfile);
          } catch (createError) {
            console.error('Failed to create new profile', createError);
            showNotification?.('Could not create user profile automatically.', 'error');
          }
        }
      };

      createOrUpdateProfile();
    } else {
      setUserProfile(null);
    }
  }, [user, showNotification]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      // Use Firebase Google sign-in
      const { auth, googleProvider } = await import('../config/firebase');
      const { signInWithPopup } = await import('firebase/auth');
  await signInWithPopup(auth, googleProvider);
      // You may want to extract user info and setUser here
      showNotification?.('Successfully signed in with Google', 'success');
      // Optionally, setUser(result.user) if you want to track Firebase user
    } catch (error) {
      console.error(error);
      showNotification?.('Google sign-in failed. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserProfile(null);
    } catch (error) {
      console.error(error);
      showNotification?.('Sign-out failed. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = await updateUser(user.id, updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error(error);
      showNotification?.('Profile update failed. Please try again.', 'error');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        showNotification?.('Sign-in disabled: Supabase not configured', 'error');
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      showNotification?.('Successfully signed in', 'success');
    } catch (error) {
      console.error(error);
      showNotification?.('Sign-in failed. Please check your credentials.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        showNotification?.('Sign-up disabled: Supabase not configured', 'error');
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      showNotification?.('Please check your email to confirm your account', 'success');
    } catch (error) {
      console.error(error);
      showNotification?.('Sign-up failed. Please try again.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
