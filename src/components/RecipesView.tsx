import React, { useState } from 'react';
import { ArchiveItem } from '../types';
import { Clock, Users, Sparkles, Star, MessageSquare, Plus } from 'lucide-react';

interface RecipesViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserEmail: string;
  onOpenAddModal: () => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  items,
  onSelect,
  onStar,
  currentUserEmail,
  onOpenAddModal,
}) => {
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'mains' | 'warm_beverages' | 'comfort'>('all');

  const recipeItems = items.filter((i) => i.category === 'recipes');
  const filteredRecipes = recipeItems.filter((i) => {
    if (recipeFilter === 'all') return true;
    return i.subCategory === recipeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#2E2A25]">
        <div>
          <div className="text-xs text-[#E8B45A] font-semibold tracking-wide uppercase mb-1">
            Fellowship Table
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE3] font-medium">
            Recipe Book
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
            Preserving the dishes and brews cooked with unconditional love at Hathbodhiya, so we can prepare them for others wherever we go.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Recipe</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#181714] border border-[#2E2A25] rounded-lg w-fit">
        <button
          onClick={() => setRecipeFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            recipeFilter === 'all'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          All Dishes ({recipeItems.length})
        </button>
        <button
          onClick={() => setRecipeFilter('mains')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            recipeFilter === 'mains'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          Mains & Stews
        </button>
        <button
          onClick={() => setRecipeFilter('warm_beverages')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            recipeFilter === 'warm_beverages'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          Teas & Brews
        </button>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((item) => {
          const isStarred = item.starredBy.includes(currentUserEmail);
          const hasImage = item.images && item.images.length > 0;

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-xl bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] hover:border-[#423D35] transition-all overflow-hidden"
            >
              <div>
                {/* Visual */}
                {hasImage ? (
                  <div
                    onClick={() => onSelect(item)}
                    className="aspect-4/3 w-full overflow-hidden bg-[#181714] cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => onSelect(item)}
                    className="p-5 pb-3 bg-[#181714] border-b border-[#2E2A25] cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#E8B45A] font-medium">
                      <span>Kitchen Archive</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#A8A196]">Communal Recipe</span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Meta strip */}
                  <div className="flex items-center gap-3 text-[11px] text-[#A8A196] mb-2">
                    {item.metadata?.prepTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E8B45A]" />
                        <span>{item.metadata.prepTime}</span>
                      </span>
                    )}
                    {item.metadata?.servings && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#E8B45A]" />
                        <span>{item.metadata.servings}</span>
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelect(item)}
                    className="font-editorial text-xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium leading-snug cursor-pointer"
                    style={{ textWrap: 'balance' }}
                  >
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="font-editorial text-xs sm:text-sm text-[#E8B45A]/90 italic mt-0.5 mb-2">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed line-clamp-3">
                    {item.content}
                  </p>

                  {/* Secret Touch Highlight */}
                  {item.metadata?.secretTouch && (
                    <div className="mt-4 p-3 rounded-lg bg-[#181714] border border-[#2E2A25] text-xs text-[#A8A196]">
                      <div className="flex items-center gap-1.5 text-[#E8B45A] font-semibold text-[11px] mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>The Hathbodhiya Touch</span>
                      </div>
                      <p className="italic text-[#d3c4b2] text-[11px] line-clamp-2">
                        {item.metadata.secretTouch}
                      </p>
                    </div>
                  )}

                  {/* Ingredients count preview */}
                  {item.metadata?.ingredients && item.metadata.ingredients.length > 0 && (
                    <div className="mt-3 text-[11px] text-[#6E675D]">
                      {item.metadata.ingredients.length} ingredients documented
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
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
                    onClick={() => onStar(item.id)}
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
                    onClick={() => onSelect(item)}
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
  );
};
