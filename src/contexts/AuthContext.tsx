import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { createUser, getUser, updateUser, User } from '../services/database';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: (accessToken: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Create or update user profile when Firebase user changes
  useEffect(() => {
    if (user) {
      const createOrUpdateProfile = async () => {
        // Check if Supabase is properly configured
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
          import.meta.env.VITE_SUPABASE_ANON_KEY && 
          import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key';

        if (!isSupabaseConfigured) {
          // Create a local profile object when Supabase is not configured
          const localProfile: User = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || '',
            phone: user.phoneNumber || '',
            company: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUserProfile(localProfile);
          console.log('Using local profile (Supabase not configured)');
          return;
        }

        try {
          // Try to get existing user profile
          const existingProfile = await getUser(user.uid);
          setUserProfile(existingProfile);
        } catch (error) {
          // If user doesn't exist or fetch failed, create new profile
          console.warn('Failed to fetch existing profile, attempting to create one.', error);
          try {
            const newProfile = await createUser({
              email: user.email || '',
              name: user.displayName || user.email?.split('@')[0] || '',
              phone: user.phoneNumber || ''
            }, user.uid);
            setUserProfile(newProfile);
          } catch (createError) {
            console.error('Failed to create new profile', createError);
            // Create a local profile as fallback instead of showing error
            const fallbackProfile: User = {
              id: user.uid,
              email: user.email || '',
              name: user.displayName || user.email?.split('@')[0] || '',
              phone: user.phoneNumber || '',
              company: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(fallbackProfile);
            console.log('Using fallback local profile due to database error');
          }
        }
      };

      createOrUpdateProfile();
    } else {
      setUserProfile(null);
    }
  }, [user, showNotification]);

  useEffect(() => {
    // Check if Firebase is configured
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project';

    if (!isFirebaseConfigured) {
      console.log('Firebase not configured, skipping auth state listener');
      setLoading(false);
      return;
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email);
      setUser(firebaseUser);
      setLoading(false);

      // Handle sign out
      if (!firebaseUser) {
        setUserProfile(null);
        // Clear any cached data
        localStorage.removeItem('user_preferences');
      }
    });

    return () => unsubscribe();
  }, [showNotification]);

  const signInWithGoogle = async () => {
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project';

    if (!isFirebaseConfigured) {
      showNotification?.('Authentication is not configured. Please set up Firebase environment variables to enable authentication.', 'error');
      console.warn('🔧 To enable authentication, please set up the following environment variables:');
      console.warn('   VITE_FIREBASE_API_KEY');
      console.warn('   VITE_FIREBASE_PROJECT_ID');
      console.warn('   VITE_FIREBASE_AUTH_DOMAIN');
      console.warn('   VITE_FIREBASE_APP_ID');
      console.warn('   See AUTHENTICATION_SETUP.md for detailed instructions');
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.email);
      showNotification?.('Successfully signed in with Google', 'success');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showNotification?.('Google sign-in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const signInWithLinkedIn = async (accessToken: string) => {
    try {
      setLoading(true);
      // Note: Firebase doesn't have built-in LinkedIn provider
      // This would need to be implemented with custom token or third-party solution
      showNotification?.('LinkedIn sign-in not yet implemented with Firebase', 'info');
    } catch (error) {
      console.error('LinkedIn sign-in error:', error);
      showNotification?.('LinkedIn sign-in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear local storage and session data
      localStorage.removeItem('user_preferences');
      sessionStorage.clear();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear user profile
      setUserProfile(null);
      
      // Redirect to homepage
      window.location.href = '/';
      
      showNotification?.('Successfully signed out', 'success');
    } catch (error) {
      console.error('Sign-out error:', error);
      showNotification?.('Sign-out failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      // Firebase automatically handles token refresh
      // This method is kept for compatibility but doesn't need to do anything
      showNotification?.('Session is automatically managed by Firebase', 'info');
    } catch (error) {
      console.error('Session refresh error:', error);
      showNotification?.('Session refresh failed', 'error');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !userProfile) return;

    // Check if Supabase is properly configured
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
      import.meta.env.VITE_SUPABASE_ANON_KEY && 
      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key';

    if (!isSupabaseConfigured) {
      // Update local profile when Supabase is not configured
      const updatedProfile = { ...userProfile, ...updates, updated_at: new Date().toISOString() };
      setUserProfile(updatedProfile);
      console.log('Updated local profile (Supabase not configured)');
      return;
    }

    try {
      const updatedProfile = await updateUser(user.uid, updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error(error);
      // Fallback to local update if database update fails
      const fallbackProfile = { ...userProfile, ...updates, updated_at: new Date().toISOString() };
      setUserProfile(fallbackProfile);
      console.log('Updated local profile due to database error');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project';

    if (!isFirebaseConfigured) {
      showNotification?.('Authentication is not configured. Please set up Firebase environment variables to enable authentication.', 'error');
      console.warn('🔧 To enable authentication, please set up the following environment variables:');
      console.warn('   VITE_FIREBASE_API_KEY');
      console.warn('   VITE_FIREBASE_PROJECT_ID');
      console.warn('   VITE_FIREBASE_AUTH_DOMAIN');
      console.warn('   VITE_FIREBASE_APP_ID');
      console.warn('   See AUTHENTICATION_SETUP.md for detailed instructions');
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful:', result.user.email);
      showNotification?.('Successfully signed in', 'success');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email address'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Sign-in failed. Please check your credentials.';
      showNotification?.(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project';

    if (!isFirebaseConfigured) {
      showNotification?.('Authentication is not configured. Please set up Firebase environment variables to enable authentication.', 'error');
      console.warn('🔧 To enable authentication, please set up the following environment variables:');
      console.warn('   VITE_FIREBASE_API_KEY');
      console.warn('   VITE_FIREBASE_PROJECT_ID');
      console.warn('   VITE_FIREBASE_AUTH_DOMAIN');
      console.warn('   VITE_FIREBASE_APP_ID');
      console.warn('   See AUTHENTICATION_SETUP.md for detailed instructions');
      return;
    }

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email sign-up successful:', result.user.email);
      showNotification?.('Account created successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Sign-up failed. Please try again.';
      showNotification?.(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
