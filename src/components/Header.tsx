import type { FC } from 'react';
import { CategoryType, CommunityMember } from '../types';

interface HeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  currentUser: CommunityMember;
  onOpenProfile: () => void;
}

const SUBTITLES: Record<CategoryType, string> = {
  all: 'Home',
  museum: 'The Museum',
  recipes: 'Recipes',
  memories: 'Memory Albums',
  wisdom: 'Remembered',
  wall: 'Community',
};

export const Header: FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  currentUser,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 pt-safe bg-[#111210]/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="h-16 px-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className="flex flex-col justify-center min-w-0 text-left pr-1"
        >
          <span className="font-editorial italic text-[22px] leading-7 text-[#F5EFE3] tracking-wide truncate">
            University of Hathbodhiya
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#A8A196] truncate">
            {SUBTITLES[currentCategory]}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-11 h-11 flex items-center justify-center shrink-0"
          title="Open profile"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
