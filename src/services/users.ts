import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { DEFAULT_AVATAR } from '../lib/constants';
import { AccountRecord, AccountStatus, CommunityMember, UserRole } from '../types';

interface AccountDoc {
  uid: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProfileDoc {
  uid: string;
  name: string;
  avatar: string;
  gradDegree: string;
  fellowshipYear: string;
  noteOfGratitude: string;
  role: UserRole;
  status: AccountStatus;
  starsEarned: number;
  contributionsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function accountRef(uid: string) {
  return doc(db, 'accounts', uid);
}

function profileRef(uid: string) {
  return doc(db, 'profiles', uid);
}

function mapProfile(id: string, data: ProfileDoc, email?: string): CommunityMember {
  return {
    id,
    name: data.name,
    email,
    avatar: data.avatar,
    gradDegree: data.gradDegree,
    fellowshipYear: data.fellowshipYear,
    noteOfGratitude: data.noteOfGratitude,
    starsEarned: data.starsEarned,
    contributionsCount: data.contributionsCount,
    role: data.role,
    status: data.status,
  };
}

export async function ensureUserDocuments(user: User): Promise<{
  account: AccountRecord;
  profile: CommunityMember;
}> {
  const existingAccount = await getDoc(accountRef(user.uid));
  const existingProfile = await getDoc(profileRef(user.uid));

  if (existingAccount.exists() && existingProfile.exists()) {
    const account = existingAccount.data() as AccountDoc;
    const profile = existingProfile.data() as ProfileDoc;
    return {
      account: { uid: account.uid, email: account.email, role: account.role, status: account.status },
      profile: mapProfile(user.uid, profile, account.email),
    };
  }

  const name = user.displayName?.trim() || user.email?.split('@')[0] || 'Fellow';
  const avatar = user.photoURL && user.photoURL.startsWith('https://') ? user.photoURL : DEFAULT_AVATAR(name);
  const now = Timestamp.now();

  const accountPayload: AccountDoc = {
    uid: user.uid,
    email: user.email ?? '',
    role: 'MEMBER',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const profilePayload: ProfileDoc = {
    uid: user.uid,
    name,
    avatar,
    gradDegree: '',
    fellowshipYear: '',
    noteOfGratitude: '',
    role: 'MEMBER',
    status: 'pending',
    starsEarned: 0,
    contributionsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const batch = writeBatch(db);
  if (!existingAccount.exists()) {
    batch.set(accountRef(user.uid), accountPayload);
  }
  if (!existingProfile.exists()) {
    batch.set(profileRef(user.uid), profilePayload);
  }
  await batch.commit();

  const accountSnap = await getDoc(accountRef(user.uid));
  const profileSnap = await getDoc(profileRef(user.uid));
  const account = accountSnap.data() as AccountDoc;
  const profile = profileSnap.data() as ProfileDoc;

  return {
    account: { uid: account.uid, email: account.email, role: account.role, status: account.status },
    profile: mapProfile(user.uid, profile, account.email),
  };
}

export async function getOwnAccount(uid: string): Promise<AccountRecord | null> {
  const snap = await getDoc(accountRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data() as AccountDoc;
  return { uid: data.uid, email: data.email, role: data.role, status: data.status };
}

export async function listApprovedMembers(): Promise<CommunityMember[]> {
  const snapshot = await getDocs(
    query(collection(db, 'profiles'), where('status', '==', 'approved'), limit(200))
  );
  return snapshot.docs.map((item: QueryDocumentSnapshot<DocumentData>) => mapProfile(item.id, item.data() as ProfileDoc));
}

export async function listPendingAccounts(): Promise<Array<AccountRecord & { name: string; avatar: string }>> {
  const accountsSnap = await getDocs(
    query(collection(db, 'accounts'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(100))
  );

  const results: Array<AccountRecord & { name: string; avatar: string }> = [];
  for (const accountDoc of accountsSnap.docs) {
    const account = accountDoc.data() as AccountDoc;
    const profileSnap = await getDoc(profileRef(account.uid));
    const profile = profileSnap.exists() ? (profileSnap.data() as ProfileDoc) : null;
    results.push({
      uid: account.uid,
      email: account.email,
      role: account.role,
      status: account.status,
      name: profile?.name ?? account.email,
      avatar: profile?.avatar ?? DEFAULT_AVATAR(account.email),
    });
  }
  return results;
}

export async function listAdminDirectory(): Promise<Array<AccountRecord & { name: string }>> {
  const snapshot = await getDocs(query(collection(db, 'accounts'), limit(200)));
  const results: Array<AccountRecord & { name: string }> = [];
  for (const accountDoc of snapshot.docs) {
    const account = accountDoc.data() as AccountDoc;
    const profileSnap = await getDoc(profileRef(account.uid));
    results.push({
      uid: account.uid,
      email: account.email,
      role: account.role,
      status: account.status,
      name: profileSnap.exists() ? (profileSnap.data() as ProfileDoc).name : account.email,
    });
  }
  return results.sort((a, b) => a.email.localeCompare(b.email));
}

export async function updateOwnProfile(
  uid: string,
  updates: Pick<CommunityMember, 'name' | 'avatar' | 'gradDegree' | 'fellowshipYear' | 'noteOfGratitude'>
): Promise<void> {
  await updateDoc(profileRef(uid), {
    name: updates.name.trim(),
    avatar: updates.avatar.trim(),
    gradDegree: (updates.gradDegree ?? '').trim(),
    fellowshipYear: (updates.fellowshipYear ?? '').trim(),
    noteOfGratitude: (updates.noteOfGratitude ?? '').trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function setMemberAccess(
  targetUid: string,
  next: { status: AccountStatus; role: UserRole }
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(accountRef(targetUid), {
    status: next.status,
    role: next.role,
    updatedAt: serverTimestamp(),
  });
  batch.update(profileRef(targetUid), {
    status: next.status,
    role: next.role,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

export function isSteward(member: CommunityMember | null): boolean {
  return member?.role === 'ADMIN' || member?.role === 'MASTER_ADMIN';
}

export function isMaster(member: CommunityMember | null): boolean {
  return member?.role === 'MASTER_ADMIN';
}
