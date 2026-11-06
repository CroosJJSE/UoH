import { BookOpen, Home, Landmark, Plus, Users } from 'lucide-react';
import { CategoryType } from '../types';

interface BottomNavProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenAddModal: () => void;
}

export function BottomNav({ currentCategory, onSelectCategory, onOpenAddModal }: BottomNavProps) {
  const activeId =
    currentCategory === 'memories' || currentCategory === 'wisdom' ? 'all' : currentCategory;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 pb-safe bg-[#181714]/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.4)] border-t border-[#2E2A25]/60">
      <div className="flex items-center justify-around h-20 px-2 relative">
        {/* Tab: Home */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors duration-200 cursor-pointer ${
            activeId === 'all' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeId === 'all' ? 'fill-[#E8B45A]/20' : ''}`} strokeWidth={1.75} />
          <span className="text-[11px] font-medium tracking-wider mt-0.5">Home</span>
        </button>

        {/* Tab: Museum */}
        <button
          type="button"
          onClick={() => onSelectCategory('museum')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors duration-200 cursor-pointer ${
            activeId === 'museum' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          <Landmark className={`w-5 h-5 ${activeId === 'museum' ? 'fill-[#E8B45A]/20' : ''}`} strokeWidth={1.75} />
          <span className="text-[11px] font-medium tracking-wider mt-0.5">Museum</span>
        </button>

        {/* Center Prominent Create / Offer Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center -mt-6 group cursor-pointer focus:outline-none"
          title="Create New Offering"
        >
          <div className="w-13 h-13 rounded-full bg-[#E8B45A] hover:bg-[#D4A045] text-[#111210] flex items-center justify-center shadow-[0_4px_16px_rgba(232,180,90,0.45)] group-hover:scale-105 active:scale-95 transition-all ring-4 ring-[#181714]">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-semibold text-[#E8B45A] tracking-wider mt-1">Offer</span>
        </button>

        {/* Tab: Recipes */}
        <button
          type="button"
          onClick={() => onSelectCategory('recipes')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors duration-200 cursor-pointer ${
            activeId === 'recipes' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeId === 'recipes' ? 'fill-[#E8B45A]/20' : ''}`} strokeWidth={1.75} />
          <span className="text-[11px] font-medium tracking-wider mt-0.5">Recipes</span>
        </button>

        {/* Tab: Community */}
        <button
          type="button"
          onClick={() => onSelectCategory('wall')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors duration-200 cursor-pointer ${
            activeId === 'wall' ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
          }`}
        >
          <Users className={`w-5 h-5 ${activeId === 'wall' ? 'fill-[#E8B45A]/20' : ''}`} strokeWidth={1.75} />
          <span className="text-[11px] font-medium tracking-wider mt-0.5">Community</span>
        </button>
      </div>
    </nav>
  );
}
