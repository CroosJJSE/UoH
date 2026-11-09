import { FirebaseError } from 'firebase/app';

const SESSION_EXPIRED_CODES = new Set([
  'unauthenticated',
  'auth/user-token-expired',
  'auth/invalid-user-token',
  'auth/id-token-expired',
  'auth/id-token-revoked',
]);

export function getFirebaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error && 'code' in error) {
    return String((error as { code: string }).code);
  }
  return '';
}

export function isAuthSessionError(error: unknown): boolean {
  return SESSION_EXPIRED_CODES.has(getFirebaseErrorCode(error));
}

export function toUserMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email or password is incorrect.';
      case 'auth/email-already-in-use':
        return 'An account already exists for this email. Sign in instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'unauthenticated':
      case 'auth/user-token-expired':
      case 'auth/invalid-user-token':
      case 'auth/id-token-expired':
      case 'auth/id-token-revoked':
        return 'Your session expired. Please sign in again.';
      case 'permission-denied':
        return 'You do not have permission to do that.';
      case 'unavailable':
        return 'The service is temporarily unavailable. Please try again.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
