import { User, onAuthStateChanged, reload } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { toUserMessage } from '../lib/errors';
import { ensureUserDocuments } from '../services/users';
import { AccountRecord, CommunityMember } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  account: AccountRecord | null;
  profile: CommunityMember | null;
  initializing: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [profile, setProfile] = useState<CommunityMember | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async (user: User | null) => {
    if (!user) {
      setFirebaseUser(null);
      setAccount(null);
      setProfile(null);
      setError(null);
      return;
    }

    await reload(user);
    setFirebaseUser(auth.currentUser);

    if (!user.emailVerified) {
      setAccount(null);
      setProfile(null);
      return;
    }

    try {
      const docs = await ensureUserDocuments(auth.currentUser ?? user);
      setAccount(docs.account);
      setProfile(docs.profile);
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        await hydrate(user);
      } finally {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [hydrate]);

  const refreshProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      await hydrate(user);
    }
  }, [hydrate]);

  const value = useMemo(
    () => ({ firebaseUser, account, profile, initializing, error, refreshProfile }),
    [firebaseUser, account, profile, initializing, error, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
