import { useState, useEffect } from 'react';
import { ArchiveItem, CategoryType, CommunityMember } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { FeaturedMemory } from './components/FeaturedMemory';
import { CategoryNavGrid } from './components/CategoryNavGrid';
import { MuseumView } from './components/MuseumView';
import { RecipesView } from './components/RecipesView';
import { AlbumsView } from './components/AlbumsView';
import { WisdomView } from './components/WisdomView';
import { CommunityWallView } from './components/CommunityWallView';
import { AddArchiveModal } from './components/AddArchiveModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { Star, MessageSquare } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [currentUser, setCurrentUser] = useState<CommunityMember | null>(null);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  
  // Modals state
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Load from storage service
    const storedItems = StorageService.getItems();
    const storedMembers = StorageService.getMembers();
    const storedUser = StorageService.getCurrentUser();

    setItems(storedItems);
    setMembers(storedMembers);
    setCurrentUser(storedUser);
  }, []);

  if (!currentUser) {
    return <div className="min-h-screen bg-[#111210]" />;
  }

  // Handle Stars
  const handleToggleStar = (itemId: string) => {
    const { updatedItem } = StorageService.toggleStar(itemId, currentUser.email);
    if (updatedItem) {
      setItems((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)));
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(updatedItem);
      }
      // Refresh members list for updated star tallies
      setMembers(StorageService.getMembers());
      setCurrentUser(StorageService.getCurrentUser());
    }
  };

  // Handle Comments
  const handleAddComment = (itemId: string, text: string) => {
    const newComment = StorageService.addComment(itemId, {
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorEmail: currentUser.email,
      text,
    });

    if (newComment) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, comments: [...i.comments, newComment] } : i
        )
      );
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) =>
          prev ? { ...prev, comments: [...prev.comments, newComment] } : null
        );
      }
    }
  };

  // Handle Save New Item
  const handleSaveNewItem = (
    newItemData: Omit<ArchiveItem, 'id' | 'createdAt' | 'starsCount' | 'starredBy' | 'comments'>
  ) => {
    const created = StorageService.addItem(newItemData);
    setItems((prev) => [created, ...prev]);
    setMembers(StorageService.getMembers());
    setCurrentUser(StorageService.getCurrentUser());
  };

  // Handle User Updates
  const handleUpdateUser = (updatedUser: CommunityMember) => {
    StorageService.setCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
    const updatedMembers = members.map((m) =>
      m.id === updatedUser.id ? updatedUser : m
    );
    StorageService.saveMembers(updatedMembers);
    setMembers(updatedMembers);
  };

  const handleSelectMember = (member: CommunityMember) => {
    StorageService.setCurrentUser(member);
    setCurrentUser(member);
  };

  // Category counts
  const categoryCounts = {
    museum: items.filter((i) => i.category === 'museum').length,
    recipes: items.filter((i) => i.category === 'recipes').length,
    memories: items.filter((i) => i.category === 'memories').length,
    wisdom: items.filter((i) => i.category === 'wisdom').length,
    wall: members.length,
  };

  // Featured Item: Recipe 1 or top starred item
  const featuredItem = items.find((i) => i.id === 'recipe-1') || items[0];

  return (
    <div className="min-h-screen bg-[#111210] text-[#F5EFE3] flex flex-col font-sans selection:bg-[#E8B45A]/30 selection:text-[#ffd187]">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {currentCategory === 'all' && (
          <div className="space-y-12">
            {/* Sanctuary Prologue */}
            <div className="text-center max-w-3xl mx-auto pt-2 pb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#E8B45A] mb-2 block">
                Open-Source Community Sanctuary
              </span>
              <h1 className="font-editorial text-3xl sm:text-5xl text-[#F5EFE3] font-normal tracking-tight leading-tight mb-4">
                University of Hathbodhiya
              </h1>
              <p className="text-sm sm:text-base text-[#A8A196] leading-relaxed">
                An intimate fellowship archive preserving the artwork, handwritten articles, comforting recipes, house hymns, and golden guidance given to us without expectations.
              </p>
            </div>

            {/* Featured Memory Hero */}
            {featuredItem && (
              <FeaturedMemory
                item={featuredItem}
                onSelect={(item) => setSelectedItem(item)}
                onStar={handleToggleStar}
                isStarred={featuredItem.starredBy.includes(currentUser.email)}
              />
            )}

            {/* The 5 Archival Rooms */}
            <CategoryNavGrid
              onSelectCategory={setCurrentCategory}
              counts={categoryCounts}
            />

            {/* Recent Communal Musings (Latest Activity stream) */}
            <div>
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#2E2A25]">
                <h3 className="font-editorial text-2xl text-[#F5EFE3] font-medium">
                  Recent Additions Across All Rooms
                </h3>
                <span className="text-xs text-[#6E675D]">
                  Living Community Feed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.slice(0, 6).map((item) => {
                  const isStarred = item.starredBy.includes(currentUser.email);
                  const hasImage = item.images && item.images.length > 0;

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between rounded-xl bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] hover:border-[#423D35] transition-all overflow-hidden"
                    >
                      <div>
                        {hasImage && (
                          <div
                            onClick={() => setSelectedItem(item)}
                            className="aspect-16/10 w-full overflow-hidden bg-[#181714] cursor-pointer"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="p-5">
                          {/* Unboxed Metadata */}
                          <div className="flex items-center gap-2 text-[11px] text-[#A8A196] mb-2">
                            <span className="text-[#E8B45A] font-medium capitalize">
                              {item.category.replace('_', ' ')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{item.createdAt}</span>
                          </div>

                          <h4
                            onClick={() => setSelectedItem(item)}
                            className="font-editorial text-xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium leading-snug cursor-pointer"
                            style={{ textWrap: 'balance' }}
                          >
                            {item.title}
                          </h4>

                          {item.subtitle && (
                            <p className="font-editorial text-xs sm:text-sm text-[#E8B45A]/90 italic mt-0.5 mb-2">
                              {item.subtitle}
                            </p>
                          )}

                          <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed line-clamp-3">
                            {item.content}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 py-3 border-t border-[#2E2A25] flex items-center justify-between text-xs text-[#A8A196]">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span className="truncate text-xs text-[#A8A196]">{item.author.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleStar(item.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                              isStarred
                                ? 'text-[#E8B45A] font-semibold'
                                : 'text-[#A8A196] hover:text-[#F5EFE3]'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#E8B45A]' : ''}`} />
                            <span className="tabular-nums">{item.starsCount}</span>
                          </button>

                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#A8A196] hover:text-[#F5EFE3] transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="tabular-nums">{item.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Category Views */}
        {currentCategory === 'museum' && (
          <MuseumView
            items={items}
            onSelect={(item) => setSelectedItem(item)}
            onStar={handleToggleStar}
            currentUserEmail={currentUser.email}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {currentCategory === 'recipes' && (
          <RecipesView
            items={items}
            onSelect={(item) => setSelectedItem(item)}
            onStar={handleToggleStar}
            currentUserEmail={currentUser.email}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {currentCategory === 'memories' && (
          <AlbumsView
            items={items}
            onSelect={(item) => setSelectedItem(item)}
            onStar={handleToggleStar}
            currentUserEmail={currentUser.email}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {currentCategory === 'wisdom' && (
          <WisdomView
            items={items}
            onSelect={(item) => setSelectedItem(item)}
            onStar={handleToggleStar}
            currentUserEmail={currentUser.email}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {currentCategory === 'wall' && (
          <CommunityWallView
            members={members}
            currentUser={currentUser}
            onSelectUserToImpersonate={handleSelectMember}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onExport={() => StorageService.exportArchive()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#2E2A25] bg-[#111210] py-10 text-xs text-[#A8A196]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-editorial text-base text-[#F5EFE3]">
              University of Hathbodhiya
            </p>
            <p className="text-[#6E675D] mt-0.5">
              Open-Source Living Fellowship Archive · Preserved with love without expectations.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[#A8A196]">
            <button
              onClick={() => StorageService.exportArchive()}
              className="hover:text-[#E8B45A] transition-colors cursor-pointer"
            >
              Export Archive (JSON)
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset archive to default seeded memories?')) {
                  StorageService.resetDefaults();
                  window.location.reload();
                }
              }}
              className="hover:text-[#ffb4ab] transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </footer>

      {/* Universal Add Modal */}
      <AddArchiveModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewItem}
        currentUser={currentUser}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onStar={handleToggleStar}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />

      {/* Profile & Switcher Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        allMembers={members}
        onUpdateCurrentUser={handleUpdateUser}
        onSelectMember={handleSelectMember}
      />
    </div>
  );
}
