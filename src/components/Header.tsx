import React from 'react';
import { CategoryType, CommunityMember } from '../types';
import { Star, Plus } from 'lucide-react';

interface HeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  currentUser: CommunityMember;
  onOpenProfile: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  currentUser,
  onOpenProfile,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111210]/95 backdrop-blur-md border-b border-[#2E2A25] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Newsreader serif, unboxed, strictly single-line) */}
        <button
          onClick={() => onSelectCategory('all')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="font-editorial text-xl sm:text-2xl text-[#F5EFE3] group-hover:text-[#E8B45A] tracking-tight transition-colors whitespace-nowrap shrink-0">
            University of Hathbodhiya
          </span>
        </button>

        {/* Zone 2: Navigation Links (single-line, subtle underlines, no pill capsules) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A8A196]">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'all'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Sanctuary
          </button>
          <button
            onClick={() => onSelectCategory('museum')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'museum'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Museum
          </button>
          <button
            onClick={() => onSelectCategory('recipes')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'recipes'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Recipe Book
          </button>
          <button
            onClick={() => onSelectCategory('memories')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'memories'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Memory Albums
          </button>
          <button
            onClick={() => onSelectCategory('wisdom')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'wisdom'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Golden Wisdom
          </button>
          <button
            onClick={() => onSelectCategory('wall')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              currentCategory === 'wall'
                ? 'text-[#E8B45A] border-b-2 border-[#E8B45A]'
                : 'hover:text-[#F5EFE3]'
            }`}
          >
            Community Wall
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Google profile button & Add to archive CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            title="Google Profile & Community Identity"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#22201D] border border-transparent hover:border-[#2E2A25] transition-all cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E8B45A]/40 group-hover:ring-[#E8B45A]"
            />
            <span className="hidden sm:inline-block text-xs font-medium text-[#F5EFE3] group-hover:text-[#E8B45A] max-w-[110px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <span className="hidden md:flex items-center gap-0.5 text-xs text-[#E8B45A] font-semibold tabular-nums">
              <Star className="w-3.5 h-3.5 fill-[#E8B45A]" />
              {currentUser.starsEarned}
            </span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto no-scrollbar px-4 py-2 border-t border-[#2E2A25]/60 bg-[#181714] text-xs">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'all' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Sanctuary
        </button>
        <button
          onClick={() => onSelectCategory('museum')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'museum' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Museum
        </button>
        <button
          onClick={() => onSelectCategory('recipes')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'recipes' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Recipes
        </button>
        <button
          onClick={() => onSelectCategory('memories')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'memories' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Albums
        </button>
        <button
          onClick={() => onSelectCategory('wisdom')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'wisdom' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Wisdom
        </button>
        <button
          onClick={() => onSelectCategory('wall')}
          className={`px-2.5 py-1 whitespace-nowrap cursor-pointer ${
            currentCategory === 'wall' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          Wall
        </button>
      </div>
    </header>
  );
};
