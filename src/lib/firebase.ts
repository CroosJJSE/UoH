import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCu8TNUQdez8XrE7U_cPqnmf66PnfTX6ro',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'university-of-hathbodhiya.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'university-of-hathbodhiya',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'university-of-hathbodhiya.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '290610324353',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:290610324353:web:637c0f83415106c0bcbe80',
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

void setPersistence(auth, browserLocalPersistence);

export { app };
