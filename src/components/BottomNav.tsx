import { BookOpen, Home, Landmark, Users } from 'lucide-react';
import { CategoryType } from '../types';

interface BottomNavProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

const TABS: Array<{
  id: CategoryType;
  label: string;
  Icon: typeof Home;
}> = [
  { id: 'all', label: 'Home', Icon: Home },
  { id: 'museum', label: 'Museum', Icon: Landmark },
  { id: 'recipes', label: 'Recipes', Icon: BookOpen },
  { id: 'wall', label: 'Community', Icon: Users },
];

export function BottomNav({ currentCategory, onSelectCategory }: BottomNavProps) {
  const activeId =
    currentCategory === 'memories' || currentCategory === 'wisdom' ? 'all' : currentCategory;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 pb-safe bg-[#181714]/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-around h-20 px-1.5">
        {TABS.map((tab) => {
          const active = activeId === tab.id;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 transition-colors duration-200 ${
                active ? 'text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'fill-[#E8B45A]/20' : ''}`} strokeWidth={1.75} />
              <span className="text-[11px] font-medium tracking-wider mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
