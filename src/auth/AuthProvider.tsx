import { User, onAuthStateChanged, reload } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { toUserMessage } from '../lib/errors';
import { ensureUserDocuments } from '../services/users';
import { AccountRecord, CommunityMember } from '../types';
import { INITIAL_MEMBERS } from '../data/initialData';

const DEMO_KEY = 'pass';

interface AuthContextValue {
  firebaseUser: User | null;
  account: AccountRecord | null;
  profile: CommunityMember | null;
  initializing: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  enterDemoMode: () => void;
  isDemoMode: boolean;
  exitDemoMode: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [profile, setProfile] = useState<CommunityMember | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DEMO_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const enterDemoMode = useCallback(() => {
    try {
      localStorage.setItem(DEMO_KEY, 'true');
    } catch {}
    setIsDemoMode(true);
    const demoMember = INITIAL_MEMBERS[0]; // Rajaraja Croos (MASTER_ADMIN)
    setProfile(demoMember);
    setAccount({
      uid: demoMember.id,
      email: demoMember.email || 'rajarajacroos2000@gmail.com',
      role: 'MASTER_ADMIN',
      status: 'approved',
    });
    setError(null);
  }, []);

  const exitDemoMode = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_KEY);
    } catch {}
    setIsDemoMode(false);
    setProfile(null);
    setAccount(null);
  }, []);

  const hydrate = useCallback(async (user: User | null) => {
    if (!user) {
      setFirebaseUser(null);
      if (!isDemoMode) {
        setAccount(null);
        setProfile(null);
      }
      setError(null);
      return;
    }

    try {
      await reload(user);
    } catch {
      // Ignore transient reload errors
    }
    setFirebaseUser(auth.currentUser);

    if (!user.emailVerified && !isDemoMode) {
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
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode && !profile) {
      enterDemoMode();
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        await hydrate(user);
      } finally {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [hydrate, isDemoMode, profile, enterDemoMode]);

  const refreshProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      await hydrate(user);
    } else if (isDemoMode) {
      enterDemoMode();
    }
  }, [hydrate, isDemoMode, enterDemoMode]);

  const value = useMemo(
    () => ({
      firebaseUser,
      account,
      profile,
      initializing,
      error,
      refreshProfile,
      enterDemoMode,
      isDemoMode,
      exitDemoMode,
    }),
    [firebaseUser, account, profile, initializing, error, refreshProfile, enterDemoMode, isDemoMode, exitDemoMode]
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
