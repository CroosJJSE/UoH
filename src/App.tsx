import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchiveItem, CategoryType, CommunityMember, ContributionDraft } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MuseumView } from './components/MuseumView';
import { RecipesView } from './components/RecipesView';
import { AlbumsView } from './components/AlbumsView';
import { WisdomView } from './components/WisdomView';
import { CommunityWallView } from './components/CommunityWallView';
import { AddArchiveModal } from './components/AddArchiveModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthScreen } from './components/AuthScreen';
import { AccessGate } from './components/AccessGate';
import { useAuth } from './auth/AuthProvider';
import { PAGE_SIZE } from './lib/constants';
import { toUserMessage } from './lib/errors';
import { listApprovedMembers, updateOwnProfile } from './services/users';
import {
  addComment,
  createContribution,
  deleteContribution,
  exportArchiveJson,
  getContribution,
  listContributions,
  toggleStar,
  updateContribution,
} from './services/contributions';
import { INITIAL_ARCHIVE_ITEMS, INITIAL_MEMBERS } from './data/initialData';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

function withDerivedStats(members: CommunityMember[], items: ArchiveItem[]): CommunityMember[] {
  return members.map((member) => {
    const owned = items.filter((item) => item.authorId === member.id);
    return {
      ...member,
      contributionsCount: Math.max(member.contributionsCount || 0, owned.length),
      starsEarned: Math.max(member.starsEarned || 0, owned.reduce((sum, item) => sum + item.starsCount, 0)),
    };
  });
}

export default function App() {
  const { firebaseUser, account, profile, initializing, error: authError, refreshProfile } = useAuth();
  const [items, setItems] = useState<ArchiveItem[]>(INITIAL_ARCHIVE_ITEMS);
  const [members, setMembers] = useState<CommunityMember[]>(INITIAL_MEMBERS);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const cursorRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const loadPage = useCallback(async (reset: boolean) => {
    setLoadingFeed(true);
    try {
      const [page, approvedMembers] = await Promise.all([
        listContributions({
          pageSize: PAGE_SIZE,
          cursor: reset ? undefined : cursorRef.current ?? undefined,
        }),
        reset ? listApprovedMembers() : Promise.resolve(null),
      ]);
      setItems((prev) => {
        if (reset) {
          return page.items.length > 0 ? page.items : INITIAL_ARCHIVE_ITEMS;
        }
        return [...prev, ...page.items];
      });
      cursorRef.current = page.cursor;
      setCursor(page.cursor);
      if (approvedMembers) {
        setMembers(approvedMembers.length > 0 ? approvedMembers : INITIAL_MEMBERS);
      }
      setFeedError(null);
    } catch (err) {
      setFeedError(toUserMessage(err));
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    if (account?.status === 'approved' && profile) {
      void loadPage(true);
    }
  }, [account?.status, profile?.id]);

  const currentUser = useMemo(() => {
    if (!profile) return null;
    const withStats = withDerivedStats([profile], items)[0];
    return withStats;
  }, [profile, items]);

  const visibleMembers = useMemo(() => withDerivedStats(members, items), [members, items]);

  if (initializing) {
    return <div className="phone-shell" />;
  }

  if (!firebaseUser) {
    return <AuthScreen />;
  }

  if (!firebaseUser.emailVerified) {
    return (
      <AccessGate
        title="Confirm your email"
        body="We sent a verification link. Confirm it, then refresh this page so a steward can review your fellowship request."
        firebaseUser={firebaseUser}
      />
    );
  }

  if (authError) {
    return <AccessGate title="Unable to load your profile" body={authError} />;
  }

  if (account?.status === 'pending') {
    return (
      <AccessGate
        title="Waiting for a steward"
        body="Your account is registered. A steward will approve you before the archive opens. This keeps the fellowship intimate and known."
        status="pending"
      />
    );
  }

  if (account?.status === 'rejected') {
    return (
      <AccessGate
        title="Request not approved"
        body="A steward declined this registration. If this was a mistake, sign out and write to the household with the email you used."
        status="rejected"
      />
    );
  }

  if (account?.status === 'suspended') {
    return (
      <AccessGate
        title="Account suspended"
        body="Your access to the living archive is paused. Please speak with a steward if you believe this should be restored."
        status="suspended"
      />
    );
  }

  if (!currentUser || account?.status !== 'approved') {
    return <div className="phone-shell" />;
  }

  const replaceItem = (updated: ArchiveItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
    setSelectedItem((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
  };

  const handleToggleStar = async (itemId: string) => {
    const item = (selectedItem && selectedItem.id === itemId ? selectedItem : null)
      ?? items.find((entry) => entry.id === itemId);
    if (!item) return;
    try {
      replaceItem(await toggleStar(item, currentUser.id));
    } catch (err) {
      setFeedError(toUserMessage(err));
    }
  };

  const handleAddComment = async (itemId: string, text: string) => {
    const item = selectedItem && selectedItem.id === itemId ? selectedItem : items.find((entry) => entry.id === itemId);
    if (!item) return;
    try {
      const comment = await addComment(item, currentUser, text);
      replaceItem({
        ...item,
        comments: [comment, ...item.comments],
        commentsCount: item.commentsCount + 1,
      });
    } catch (err) {
      setFeedError(toUserMessage(err));
    }
  };

  const handleSaveItem = async (draft: ContributionDraft, existingId?: string) => {
    if (existingId) {
      await updateContribution(existingId, draft);
      const refreshed = await getContribution(existingId);
      if (refreshed) {
        replaceItem(refreshed);
      }
      setEditingItem(null);
      return;
    }

    const created = await createContribution(currentUser, draft);
    setItems((prev) => [created, ...prev]);
  };

  const handleSelectItem = async (item: ArchiveItem) => {
    setSelectedItem(item);
    try {
      const full = await getContribution(item.id);
      if (full) setSelectedItem(full);
    } catch (err) {
      setFeedError(toUserMessage(err));
    }
  };

  const handleDelete = async (item: ArchiveItem) => {
    if (!window.confirm('Remove this contribution from the archive?')) return;
    try {
      await deleteContribution(item.id);
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      setSelectedItem(null);
    } catch (err) {
      setFeedError(toUserMessage(err));
    }
  };

  const handleUpdateUser = async (updatedUser: CommunityMember) => {
    await updateOwnProfile(updatedUser.id, updatedUser);
    await refreshProfile();
  };

  const categoryCounts = {
    museum: items.filter((i) => i.category === 'museum').length,
    recipes: items.filter((i) => i.category === 'recipes').length,
    memories: items.filter((i) => i.category === 'memories').length,
    wisdom: items.filter((i) => i.category === 'wisdom').length,
    wall: visibleMembers.length,
  };

  return (
    <div className="phone-shell text-[#F5EFE3] selection:bg-[#E8B45A]/30 selection:text-[#ffd187]">
      <Header
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="w-full min-h-dvh pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] px-5 overflow-x-hidden">
        {feedError && (
          <div className="mb-4 p-3 rounded-lg bg-[#181714] text-xs text-[#ffb4ab]">
            {feedError}
          </div>
        )}

        {currentCategory === 'all' && (
          <HomeView
            items={items}
            currentUser={currentUser}
            counts={categoryCounts}
            onSelectCategory={setCurrentCategory}
            onSelectItem={(item) => void handleSelectItem(item)}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentCategory === 'museum' && (
          <MuseumView
            items={items}
            onSelect={(item) => void handleSelectItem(item)}
            onStar={(id) => void handleToggleStar(id)}
            currentUserId={currentUser.id}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentCategory === 'recipes' && (
          <RecipesView
            items={items}
            onSelect={(item) => void handleSelectItem(item)}
            onStar={(id) => void handleToggleStar(id)}
            currentUserId={currentUser.id}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentCategory === 'memories' && (
          <AlbumsView
            items={items}
            onSelect={(item) => void handleSelectItem(item)}
            onStar={(id) => void handleToggleStar(id)}
            currentUserId={currentUser.id}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentCategory === 'wisdom' && (
          <WisdomView
            items={items}
            onSelect={(item) => void handleSelectItem(item)}
            onStar={(id) => void handleToggleStar(id)}
            currentUserId={currentUser.id}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentCategory === 'wall' && (
          <CommunityWallView
            members={visibleMembers}
            currentUser={currentUser}
            items={items}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onExport={() => void exportArchiveJson(items, visibleMembers)}
            onSelectItem={(item) => void handleSelectItem(item)}
          />
        )}

        {cursor && (
          <div className="mt-8 flex justify-center pb-4">
            <button
              type="button"
              disabled={loadingFeed}
              onClick={() => void loadPage(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#E8B45A] bg-[#181714]"
            >
              {loadingFeed ? 'Loading…' : 'Load earlier memories'}
            </button>
          </div>
        )}
      </main>

      <BottomNav currentCategory={currentCategory} onSelectCategory={setCurrentCategory} />

      <AddArchiveModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        currentUser={currentUser}
        editingItem={editingItem}
      />

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onStar={(id) => void handleToggleStar(id)}
        onAddComment={(id, text) => void handleAddComment(id, text)}
        onEdit={(item) => {
          setEditingItem(item);
          setSelectedItem(null);
          setIsAddModalOpen(true);
        }}
        onDelete={(item) => void handleDelete(item)}
        currentUser={currentUser}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateUser}
      />
    </div>
  );
}
