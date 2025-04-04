import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST;

// Firebase configuration from environment variables
const firebaseConfig = isTest 
  ? {
      // Mock config for testing
      apiKey: 'test-api-key',
      authDomain: 'test-project.firebaseapp.com',
      projectId: 'test-project',
      storageBucket: 'test-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456789',
      measurementId: 'G-ABCDEF123',
    }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence with unlimited cache size for better performance
if (typeof window !== 'undefined' && !isTest) {
  enableIndexedDbPersistence(db, { forceOwnership: true })
    .then(() => {
      console.log('Offline persistence enabled for Firestore');
    })
    .catch((error) => {
      console.error('Error enabling offline persistence:', error);
      if (error.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (error.code === 'unimplemented') {
        // The current browser does not support all of the features required for persistence
        console.warn('Offline persistence not supported in this browser.');
      }
    });
}

export { app, auth, db, storage }; 