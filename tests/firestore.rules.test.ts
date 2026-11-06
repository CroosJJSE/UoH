import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';

const PROJECT_ID = 'demo-uoh';
const NOW = new Date();

let testEnv: RulesTestEnvironment;

function authed(uid: string, email: string, emailVerified = true) {
  return testEnv.authenticatedContext(uid, { email, email_verified: emailVerified }).firestore();
}

function accountDoc(uid: string, email: string, role: string, status: string) {
  return {
    uid,
    email,
    role,
    status,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

function profileDoc(uid: string, role: string, status: string) {
  return {
    uid,
    name: uid,
    avatar: 'https://example.com/a.png',
    gradDegree: '',
    fellowshipYear: '',
    noteOfGratitude: '',
    role,
    status,
    starsEarned: 0,
    contributionsCount: 0,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

function contributionDoc(authorId: string) {
  return {
    authorId,
    category: 'wisdom',
    subCategory: 'golden_advice',
    title: 'A remembered word',
    subtitle: '',
    content: 'Love without calculating the cost.',
    images: [],
    author: {
      name: authorId,
      avatar: 'https://example.com/a.png',
      fellowshipYear: '',
    },
    createdAt: NOW,
    updatedAt: NOW,
    starsCount: 0,
    starredBy: [],
    commentsCount: 0,
    metadata: {},
  };
}

async function seedUser(uid: string, email: string, role: string, status: string) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'accounts', uid), accountDoc(uid, email, role, status));
    await setDoc(doc(db, 'profiles', uid), profileDoc(uid, role, status));
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(resolve('firestore.rules'), 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('accounts and roles', () => {
  it('rejects unauthenticated reads', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'accounts', 'anyone')));
    await assertFails(getDoc(doc(db, 'profiles', 'anyone')));
    await assertFails(getDocs(collection(db, 'contributions')));
  });

  it('lets a verified user create a pending MEMBER account and profile only', async () => {
    const db = authed('u1', 'u1@example.com');
    await assertSucceeds(setDoc(doc(db, 'accounts', 'u1'), accountDoc('u1', 'u1@example.com', 'MEMBER', 'pending')));
    await assertSucceeds(setDoc(doc(db, 'profiles', 'u1'), profileDoc('u1', 'MEMBER', 'pending')));
  });

  it('blocks self-assignment of ADMIN or approved status on create', async () => {
    const db = authed('u1', 'u1@example.com');
    await assertFails(setDoc(doc(db, 'accounts', 'u1'), accountDoc('u1', 'u1@example.com', 'ADMIN', 'pending')));
    await assertFails(setDoc(doc(db, 'accounts', 'u1'), accountDoc('u1', 'u1@example.com', 'MEMBER', 'approved')));
    await assertFails(setDoc(doc(db, 'profiles', 'u1'), profileDoc('u1', 'MASTER_ADMIN', 'pending')));
  });

  it('blocks unverified email from creating an account', async () => {
    const db = authed('u1', 'u1@example.com', false);
    await assertFails(setDoc(doc(db, 'accounts', 'u1'), accountDoc('u1', 'u1@example.com', 'MEMBER', 'pending')));
  });

  it('prevents a member from approving themselves', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'pending');
    const db = authed('u1', 'u1@example.com');
    await assertFails(
      updateDoc(doc(db, 'accounts', 'u1'), { status: 'approved', updatedAt: NOW })
    );
  });

  it('lets an admin approve a pending member but not grant ADMIN', async () => {
    await seedUser('admin', 'admin@example.com', 'ADMIN', 'approved');
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'pending');
    const db = authed('admin', 'admin@example.com');
    await assertSucceeds(
      updateDoc(doc(db, 'accounts', 'u1'), { status: 'approved', role: 'MEMBER', updatedAt: NOW })
    );
    await seedUser('u2', 'u2@example.com', 'MEMBER', 'pending');
    await assertFails(
      updateDoc(doc(db, 'accounts', 'u2'), { status: 'approved', role: 'ADMIN', updatedAt: NOW })
    );
  });

  it('lets MASTER_ADMIN promote and demote admins', async () => {
    await seedUser('master', 'master@example.com', 'MASTER_ADMIN', 'approved');
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    const db = authed('master', 'master@example.com');
    await assertSucceeds(
      updateDoc(doc(db, 'accounts', 'u1'), { role: 'ADMIN', status: 'approved', updatedAt: NOW })
    );
    await assertSucceeds(
      updateDoc(doc(db, 'accounts', 'u1'), { role: 'MEMBER', status: 'approved', updatedAt: NOW })
    );
  });

  it('protects MASTER_ADMIN from demotion, including by themselves', async () => {
    await seedUser('master', 'master@example.com', 'MASTER_ADMIN', 'approved');
    await seedUser('admin', 'admin@example.com', 'ADMIN', 'approved');
    const masterDb = authed('master', 'master@example.com');
    const adminDb = authed('admin', 'admin@example.com');
    await assertFails(
      updateDoc(doc(masterDb, 'accounts', 'master'), { role: 'ADMIN', status: 'approved', updatedAt: NOW })
    );
    await assertFails(
      updateDoc(doc(adminDb, 'accounts', 'master'), { role: 'MEMBER', status: 'approved', updatedAt: NOW })
    );
    await assertFails(
      updateDoc(doc(masterDb, 'accounts', 'admin'), { role: 'MASTER_ADMIN', status: 'approved', updatedAt: NOW })
    );
  });

  it('hides account emails from ordinary members', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await seedUser('u2', 'u2@example.com', 'MEMBER', 'approved');
    const db = authed('u1', 'u1@example.com');
    await assertFails(getDoc(doc(db, 'accounts', 'u2')));
    await assertSucceeds(getDoc(doc(db, 'profiles', 'u2')));
  });
});

describe('contributions, stars, and comments', () => {
  it('blocks pending users from reading community content', async () => {
    await seedUser('pending', 'p@example.com', 'MEMBER', 'pending');
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'contributions', 'c1'), contributionDoc('u1'));
    });
    const db = authed('pending', 'p@example.com');
    await assertFails(getDoc(doc(db, 'contributions', 'c1')));
  });

  it('lets approved members create their own contributions only', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    const db = authed('u1', 'u1@example.com');
    await assertSucceeds(addDoc(collection(db, 'contributions'), contributionDoc('u1')));
    await assertFails(addDoc(collection(db, 'contributions'), contributionDoc('someone-else')));
  });

  it('prevents duplicate stars from the same user', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await seedUser('u2', 'u2@example.com', 'MEMBER', 'approved');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'contributions', 'c1'), contributionDoc('u1'));
    });
    const db = authed('u2', 'u2@example.com');
    await assertSucceeds(
      updateDoc(doc(db, 'contributions', 'c1'), {
        starredBy: ['u2'],
        starsCount: 1,
        updatedAt: NOW,
      })
    );
    await assertFails(
      updateDoc(doc(db, 'contributions', 'c1'), {
        starredBy: ['u2', 'u2'],
        starsCount: 2,
        updatedAt: NOW,
      })
    );
  });

  it('lets owners edit and delete their contributions; members cannot delete others', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await seedUser('u2', 'u2@example.com', 'MEMBER', 'approved');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'contributions', 'c1'), contributionDoc('u1'));
    });
    const owner = authed('u1', 'u1@example.com');
    const other = authed('u2', 'u2@example.com');
    await assertSucceeds(
      updateDoc(doc(owner, 'contributions', 'c1'), {
        title: 'Revised title',
        updatedAt: NOW,
      })
    );
    await assertFails(deleteDoc(doc(other, 'contributions', 'c1')));
    await assertSucceeds(deleteDoc(doc(owner, 'contributions', 'c1')));
  });

  it('lets admins delete any contribution', async () => {
    await seedUser('admin', 'admin@example.com', 'ADMIN', 'approved');
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'contributions', 'c1'), contributionDoc('u1'));
    });
    const db = authed('admin', 'admin@example.com');
    await assertSucceeds(deleteDoc(doc(db, 'contributions', 'c1')));
  });

  it('lets approved members comment', async () => {
    await seedUser('u1', 'u1@example.com', 'MEMBER', 'approved');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'contributions', 'c1'), contributionDoc('u1'));
    });
    const db = authed('u1', 'u1@example.com');
    await assertSucceeds(
      addDoc(collection(db, 'contributions', 'c1', 'comments'), {
        authorId: 'u1',
        authorName: 'u1',
        authorAvatar: 'https://example.com/a.png',
        text: 'Amen.',
        createdAt: NOW,
      })
    );
  });
});

describe('sanity', () => {
  it('loads rules', () => {
    expect(readFileSync(resolve('firestore.rules'), 'utf8')).toContain('MASTER_ADMIN');
  });
});
