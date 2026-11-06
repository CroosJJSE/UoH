import type { FC } from 'react';
import { ArchiveItem } from '../types';
import { Plus } from 'lucide-react';

interface RecipesViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserId: string;
  onOpenAddModal: () => void;
}

export const RecipesView: FC<RecipesViewProps> = ({
  items,
  onSelect,
  onOpenAddModal,
}) => {
  const recipeItems = items.filter((i) => i.category === 'recipes');

  return (
    <div className="flex flex-col w-full">
      <header className="flex flex-col pb-4">
        <div className="flex items-center gap-1.5 text-[#E8B45A] mb-1.5">
          <span className="text-[11px] uppercase tracking-widest font-semibold">From the fellowship kitchen</span>
        </div>
        <h1 className="font-editorial italic text-[34px] leading-[42px] text-[#F5EFE3] tracking-tight">
          The Recipe Book
        </h1>
        <p className="font-editorial text-[20px] text-[#E8B45A]/90 italic mt-1">
          “Made with love.”
        </p>
        <span className="text-[11px] text-[#E8B45A]/80 italic mt-3">{recipeItems.length} archived entries</span>
      </header>

      <div className="grid grid-cols-2 gap-3.5">
        {recipeItems.map((item) => (
          <article key={item.id} className="bg-[#22201D] rounded-xl overflow-hidden flex flex-col justify-between min-w-0">
            <div>
              <div className="relative w-full aspect-4/3 bg-[#181714] overflow-hidden">
                {item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6E675D] text-[11px] px-2 text-center">
                    Kitchen archive
                  </div>
                )}
                {item.metadata?.prepTime && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#111210]/80 text-[#E8B45A] text-[10px] max-w-[70%] truncate">
                    {item.metadata.prepTime}
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-1 min-w-0">
                <span className="text-[10px] text-[#6E675D] tracking-wider uppercase truncate">{item.author.name}</span>
                <h3 className="font-editorial text-[16px] leading-snug text-[#F5EFE3] line-clamp-2">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-[#A8A196] line-clamp-2">{item.content}</p>
              </div>
            </div>
            <div className="p-3 pt-0">
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="w-full py-2 rounded-lg bg-[#181714] text-[#F5EFE3] text-[12px] font-semibold"
              >
                View Recipe
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="mt-6 w-full py-3 rounded-xl bg-[#E8B45A] text-[#111210] text-[14px] font-semibold flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Recipe
      </button>
    </div>
  );
};
