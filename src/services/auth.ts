import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getFirebaseErrorCode, isAuthSessionError } from '../lib/errors';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
}

export async function registerWithEmail(email: string, password: string, displayName: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: displayName.trim() });
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function ensureAuthSession(): Promise<User> {
  const user = auth.currentUser;
  if (!user) {
    const error = new Error('Your session expired. Please sign in again.');
    (error as Error & { code: string }).code = 'unauthenticated';
    throw error;
  }

  try {
    await user.getIdToken(true);
    return user;
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined);
    throw error;
  }
}

export async function withAuthSession<T>(operation: () => Promise<T>): Promise<T> {
  await ensureAuthSession();
  try {
    return await operation();
  } catch (error) {
    const lost = await signOutIfSessionLost(error);
    if (lost) {
      const expired = new Error('Your session expired. Please sign in again.');
      (expired as Error & { code: string }).code = 'unauthenticated';
      throw expired;
    }
    throw error;
  }
}

export async function signOutIfSessionLost(error: unknown): Promise<boolean> {
  const code = getFirebaseErrorCode(error);

  if (isAuthSessionError(error)) {
    if (auth.currentUser) {
      await firebaseSignOut(auth).catch(() => undefined);
    }
    return true;
  }

  if (code !== 'permission-denied') {
    return false;
  }

  if (!auth.currentUser) {
    return true;
  }

  try {
    await auth.currentUser.getIdToken(true);
    return false;
  } catch {
    await firebaseSignOut(auth).catch(() => undefined);
    return true;
  }
}

export async function resendVerification(user: User): Promise<void> {
  await sendEmailVerification(user);
}
