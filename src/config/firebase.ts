import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: 'AIzaSyAy56TjDOAHsCXMgNGvnaK9ZIYztkL-DUk',
  authDomain: 'setu-studios.firebaseapp.com',
  projectId: 'setu-studios',
  storageBucket: 'setu-studios.firebasestorage.app',
  messagingSenderId: '1055699153199',
  appId: '1:1055699153199:web:76b7d8fb6d96955215b1da',
  measurementId: 'G-HRCQGCJG6G'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
