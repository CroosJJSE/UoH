import type { FC } from 'react';
import { ArchiveItem } from '../types';
import { Plus, UtensilsCrossed } from 'lucide-react';

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
          <span className="text-[11px] uppercase tracking-widest font-semibold">From the world famous chef Rohan W</span>
        </div>
        <h1 className="font-editorial italic text-[34px] leading-[42px] text-[#F5EFE3] tracking-tight">
          The Recipe Book
        </h1>
        <span className="text-[11px] text-[#E8B45A]/80 italic mt-2">{recipeItems.length} archived dishes</span>
      </header>

      <div className="grid grid-cols-2 gap-3.5">
        {recipeItems.map((item) => {
          const ingredientCount = item.metadata?.ingredients?.length || 0;
          const stepCount = item.metadata?.steps?.length || 0;

          return (
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#6E675D] gap-1 px-2 text-center">
                      <UtensilsCrossed className="w-5 h-5 text-[#E8B45A]/50" />
                      <span className="text-[11px]">Fellowship Recipe</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1.5 min-w-0">
                  <span className="text-[10px] text-[#6E675D] tracking-wider uppercase truncate">{item.author.name}</span>
                  <h3 className="font-editorial text-[17px] leading-snug text-[#F5EFE3] line-clamp-2">{item.title}</h3>
                  <div className="text-[11px] text-[#A8A196]">
                    {ingredientCount > 0 && <span>{ingredientCount} ingredients</span>}
                    {ingredientCount > 0 && stepCount > 0 && <span> · </span>}
                    {stepCount > 0 && <span>{stepCount} steps</span>}
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full py-2 rounded-lg bg-[#181714] hover:bg-[#2B2824] text-[#F5EFE3] text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  View Recipe
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="mt-6 w-full py-3 rounded-xl bg-[#E8B45A] hover:bg-[#D4A045] text-[#111210] text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Recipe
      </button>
    </div>
  );
};
