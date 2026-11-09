import { FirebaseError } from 'firebase/app';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { withAuthSession } from './auth';
import { PAGE_SIZE, COMMENT_PAGE_SIZE, DEFAULT_AVATAR } from '../lib/constants';
import { ArchiveCategory, ArchiveItem, Comment, CommunityMember, ContributionDraft, recipeDescription } from '../types';

function isAlreadyExists(err: unknown): boolean {
  return (
    (err instanceof FirebaseError && err.code === 'already-exists') ||
    (err instanceof Error && /already exists/i.test(err.message))
  );
}

interface ContributionDoc {
  authorId: string;
  category: ArchiveCategory;
  subCategory: string;
  title: string;
  subtitle: string;
  content: string;
  images: string[];
  author: {
    name: string;
    avatar: string;
    fellowshipYear: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  starsCount: number;
  starredBy: string[];
  commentsCount: number;
  metadata: ArchiveItem['metadata'];
}

function contributionsCol() {
  return collection(db, 'contributions');
}

function formatDay(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString().split('T')[0];
}

function compactMetadata(metadata: ArchiveItem['metadata'] = {}): ArchiveItem['metadata'] {
  const cleaned: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    cleaned[key] = value;
  }
  return cleaned;
}

function mapContribution(id: string, data: ContributionDoc, comments: Comment[] = []): ArchiveItem {
  return {
    id,
    authorId: data.authorId,
    category: data.category,
    subCategory: data.subCategory,
    title: data.title,
    content: data.category === 'recipes' ? recipeDescription(data) : data.content,
    images: data.images ?? [],
    author: {
      name: data.author.name,
      avatar: data.author.avatar,
      fellowshipYear: data.author.fellowshipYear || undefined,
    },
    createdAt: data.createdAt ? formatDay(data.createdAt) : '',
    starsCount: data.starsCount ?? 0,
    starredBy: data.starredBy ?? [],
    comments,
    commentsCount: data.commentsCount ?? comments.length,
    metadata: data.metadata ?? {},
  };
}

export async function listContributions(options: {
  category?: ArchiveCategory;
  authorId?: string;
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
}): Promise<{ items: ArchiveItem[]; cursor: QueryDocumentSnapshot<DocumentData> | null }> {
  const constraints: QueryConstraint[] = [];
  if (options.category) {
    constraints.push(where('category', '==', options.category));
  }
  if (options.authorId) {
    constraints.push(where('authorId', '==', options.authorId));
  }
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(options.pageSize ?? PAGE_SIZE));
  if (options.cursor) {
    constraints.push(startAfter(options.cursor));
  }

  return withAuthSession(async () => {
    const snapshot = await getDocs(query(contributionsCol(), ...constraints));
    const items = snapshot.docs.map((item: QueryDocumentSnapshot<DocumentData>) =>
      mapContribution(item.id, item.data() as ContributionDoc)
    );
    const nextCursor = snapshot.docs.length === (options.pageSize ?? PAGE_SIZE)
      ? snapshot.docs[snapshot.docs.length - 1]
      : null;

    return { items, cursor: nextCursor };
  });
}

export async function getContribution(id: string): Promise<ArchiveItem | null> {
  return withAuthSession(async () => {
    const snap = await getDoc(doc(db, 'contributions', id));
    if (!snap.exists()) return null;
    const comments = await listComments(id);
    return mapContribution(id, snap.data() as ContributionDoc, comments);
  });
}

function buildPayload(author: CommunityMember, draft: ContributionDraft): ContributionDoc {
  const now = Timestamp.now();
  const title = draft.title.trim();
  return {
    authorId: author.id,
    category: draft.category,
    subCategory: draft.subCategory,
    title,
    subtitle: '',
    content: draft.content.trim() || title,
    images: draft.images,
    author: {
      name: author.name,
      avatar: author.avatar?.startsWith('https://') ? author.avatar : DEFAULT_AVATAR(author.name),
      fellowshipYear: author.fellowshipYear || '',
    },
    createdAt: now,
    updatedAt: now,
    starsCount: 0,
    starredBy: [],
    commentsCount: 0,
    metadata: compactMetadata(draft.metadata),
  };
}

function contentUpdate(draft: ContributionDraft) {
  const title = draft.title.trim();
  return {
    category: draft.category,
    subCategory: draft.subCategory,
    title,
    content: draft.content.trim() || title,
    images: draft.images,
    metadata: compactMetadata(draft.metadata),
    updatedAt: serverTimestamp(),
  };
}

export async function createContribution(
  author: CommunityMember,
  draft: ContributionDraft,
  existingId?: string
): Promise<ArchiveItem> {
  return withAuthSession(async () => {
    const payload = buildPayload(author, draft);
    const ref = existingId ? doc(db, 'contributions', existingId) : doc(contributionsCol());

    try {
      await setDoc(ref, payload);
    } catch (err) {
      if (!isAlreadyExists(err)) throw err;
      await updateDoc(ref, contentUpdate(draft));
    }

    return mapContribution(ref.id, payload);
  });
}

export async function updateContribution(
  id: string,
  draft: ContributionDraft
): Promise<void> {
  await withAuthSession(() => updateDoc(doc(db, 'contributions', id), contentUpdate(draft)));
}

export async function deleteContribution(id: string): Promise<void> {
  await withAuthSession(async () => {
    const commentsSnap = await getDocs(collection(db, 'contributions', id, 'comments'));
    const batch = writeBatch(db);
    commentsSnap.docs.forEach((commentDoc: QueryDocumentSnapshot<DocumentData>) => batch.delete(commentDoc.ref));
    batch.delete(doc(db, 'contributions', id));
    await batch.commit();
  });
}

export async function toggleStar(item: ArchiveItem, uid: string): Promise<ArchiveItem> {
  const alreadyStarred = item.starredBy.includes(uid);
  const starredBy = alreadyStarred
    ? item.starredBy.filter((id) => id !== uid)
    : [...item.starredBy, uid];
  const starsCount = starredBy.length;

  await withAuthSession(() =>
    updateDoc(doc(db, 'contributions', item.id), {
      starredBy,
      starsCount,
      updatedAt: serverTimestamp(),
    })
  );

  return { ...item, starredBy, starsCount };
}

export async function listComments(contributionId: string): Promise<Comment[]> {
  const snapshot = await getDocs(
    query(
      collection(db, 'contributions', contributionId, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(COMMENT_PAGE_SIZE)
    )
  );

  return snapshot.docs.map((item: QueryDocumentSnapshot<DocumentData>) => {
    const data = item.data() as {
      authorId: string;
      authorName: string;
      authorAvatar: string;
      text: string;
      createdAt: Timestamp;
    };
    return {
      id: item.id,
      authorId: data.authorId,
      authorName: data.authorName,
      authorAvatar: data.authorAvatar,
      text: data.text,
      createdAt: data.createdAt ? formatDay(data.createdAt) : '',
    };
  });
}

export async function addComment(
  item: ArchiveItem,
  author: CommunityMember,
  text: string
): Promise<Comment> {
  const now = Timestamp.now();
  const comment = {
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    text: text.trim(),
    createdAt: now,
  };

  const commentRef = doc(collection(db, 'contributions', item.id, 'comments'));
  await withAuthSession(async () => {
    const batch = writeBatch(db);
    batch.set(commentRef, comment);
    batch.update(doc(db, 'contributions', item.id), {
      commentsCount: item.commentsCount + 1,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  });

  return {
    id: commentRef.id,
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    text: text.trim(),
    createdAt: formatDay(now),
  };
}

export async function exportArchiveJson(items: ArchiveItem[], members: CommunityMember[]): Promise<void> {
  const exportData = {
    communityName: 'University of Hathbodhiya',
    exportDate: new Date().toISOString(),
    items,
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      gradDegree: member.gradDegree,
      fellowshipYear: member.fellowshipYear,
      noteOfGratitude: member.noteOfGratitude,
      starsEarned: member.starsEarned,
      contributionsCount: member.contributionsCount,
    })),
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `hathbodhiya_archive_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
