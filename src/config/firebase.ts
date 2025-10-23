import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return !!(import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-api-key' &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder-project');
};

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'placeholder-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'placeholder-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'placeholder-measurement-id'
};

// Initialize Firebase only if configured
let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured. Authentication features will be disabled.');
  // Create mock objects to prevent errors
  auth = {
    currentUser: null,
    signInWithPopup: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.reject(new Error('Firebase not configured')),
    onAuthStateChanged: () => () => {}
  };
  googleProvider = {};
}

export { auth, googleProvider };

// Analytics is optional; initialize only when supported (e.g., in browser)
export const analytics = (async () => {
  if (typeof window === 'undefined') return null;
  try {
    if (await isSupported()) return getAnalytics(app);
  } catch {
    // analytics not supported in this environment
    return null;
  }
  return null;
})();

export default app;
