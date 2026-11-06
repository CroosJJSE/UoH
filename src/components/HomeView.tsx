import { ArchiveItem, CategoryType, CommunityMember } from '../types';
import { NotebookPen, Plus } from 'lucide-react';

interface HomeViewProps {
  items: ArchiveItem[];
  currentUser: CommunityMember;
  counts: {
    museum: number;
    recipes: number;
    memories: number;
    wisdom: number;
  };
  onSelectCategory: (cat: CategoryType) => void;
  onSelectItem: (item: ArchiveItem) => void;
  onOpenAddModal: () => void;
}

const SHELVES: Array<{
  id: CategoryType;
  emoji: string;
  title: string;
  description: string;
  countKey: 'museum' | 'recipes' | 'memories' | 'wisdom';
}> = [
  { id: 'museum', emoji: '🎨', title: 'Museum', description: 'Art, writings, creativity & wisdom', countKey: 'museum' },
  { id: 'recipes', emoji: '🍲', title: 'Recipe Book', description: 'Meals we love and want to recreate', countKey: 'recipes' },
  { id: 'memories', emoji: '📸', title: 'Albums', description: 'Moments worth keeping forever', countKey: 'memories' },
  { id: 'wisdom', emoji: '🕊️', title: 'Remembered', description: 'Advice, reflections & life lessons', countKey: 'wisdom' },
];

const LABELS: Record<string, string> = {
  museum: '🎨 Museum',
  recipes: '🍲 Recipe Book',
  memories: '📸 Album',
  wisdom: '🕊️ Wisdom',
};

export function HomeView({
  items,
  currentUser,
  counts,
  onSelectCategory,
  onSelectItem,
  onOpenAddModal,
}: HomeViewProps) {
  const firstName = currentUser.name.split(' ')[0] || 'friend';
  const featured = items.find((item) => item.images.length > 0) ?? items[0];
  const quoteItem = items.find((item) => item.category === 'wisdom' && item.metadata?.goldenQuote);
  const recent = items.slice(0, 6);

  return (
    <div className="flex flex-col w-full gap-8">
      <section className="w-full overflow-hidden rounded-xl bg-[#181714] shadow-md">
        <img
          src="/bookshelf.jpeg"
          alt="The Hathbodhiya bookshelves"
          className="w-full aspect-16/10 object-cover object-center"
        />
      </section>

      <section className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B45A] animate-pulse" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#E8B45A]">
            The Hearthside Journal
          </span>
        </div>
        <h2 className="font-editorial text-[20px] leading-7 text-[#F5EFE3]">
          Peace be with you, {firstName}
        </h2>
        <p className="text-[13px] leading-5 text-[#A8A196]">
          Treasuring grace and friendship since 2019.
        </p>
      </section>

      {featured && (
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onSelectItem(featured)}
            className="relative w-full rounded-xl bg-[#22201D] p-1.5 shadow-md overflow-hidden text-left"
          >
            {featured.images[0] && (
              <div className="relative w-full aspect-16/10 rounded-lg overflow-hidden bg-[#181714]">
                <img
                  alt={featured.title}
                  src={featured.images[0]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover contrast-[1.02] brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22201D]/90 via-transparent to-black/20" />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#111210]/80 backdrop-blur-sm">
                  <span className="text-[11px] text-[#E8B45A] tracking-wider capitalize">
                    {featured.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[11px] text-[#F5EFE3] italic truncate">{featured.title}</p>
                </div>
              </div>
            )}
            <div className="p-3 pt-4 flex flex-col gap-1.5">
              <h1 className="font-editorial text-[28px] leading-9 text-[#F5EFE3]">
                Some things are too precious to forget.
              </h1>
              <p className="text-[15px] leading-6 text-[#A8A196]">
                A little home for our memories, wisdom, and everything we share around this table.
              </p>
            </div>
          </button>
        </section>
      )}

      <section className="w-full">
        <div className="relative rounded-xl bg-[#22201D] p-5 shadow-sm overflow-hidden flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#181714] flex items-center justify-center text-[#E8B45A]">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-editorial text-[20px] leading-7 text-[#F5EFE3]">
              Every member brings a stone to the altar.
            </p>
            <p className="text-[13px] leading-5 text-[#6E675D] mt-0.5">
              Add a story, recipe, photo, or verse for tonight's quiet record.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-1 w-full py-3 px-5 rounded-lg bg-[#E8B45A] text-[#0d0e0d] text-[14px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add a Memory
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h3 className="font-editorial text-[20px] text-[#F5EFE3]">Scrapbook Shelves</h3>
          <span className="text-[11px] text-[#6E675D] tracking-wider uppercase">4 Collections</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SHELVES.map((shelf) => (
            <button
              key={shelf.id}
              type="button"
              onClick={() => onSelectCategory(shelf.id)}
              className="rounded-xl bg-[#22201D] p-5 flex flex-col justify-between min-h-[148px] text-left"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{shelf.emoji}</span>
                <span className="text-[11px] text-[#E8B45A] bg-[#181714] px-2 py-0.5 rounded-full tabular-nums">
                  {counts[shelf.countKey]}
                </span>
              </div>
              <div className="flex flex-col mt-3">
                <span className="font-editorial text-[20px] leading-7 text-[#F5EFE3]">{shelf.title}</span>
                <span className="text-[13px] leading-5 text-[#A8A196] mt-0.5">{shelf.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="w-full">
        <div className="relative rounded-xl bg-[#181714] p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#E8B45A] tracking-widest uppercase">Words Worth Keeping</span>
          </div>
          <blockquote className="font-editorial text-[26px] leading-8 text-[#F5EFE3] italic">
            “{quoteItem?.metadata?.goldenQuote || 'The table is where strangers become brothers and bread becomes praise.'}”
          </blockquote>
          <div className="flex items-center justify-between pt-1 gap-3">
            <span className="text-[13px] text-[#A8A196] min-w-0 truncate">
              {quoteItem?.title || 'Fellowship reflection'}
            </span>
            <span className="text-[11px] text-[#6E675D] shrink-0">
              {quoteItem?.metadata?.scripturePassage || quoteItem?.createdAt || ''}
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-editorial text-[20px] text-[#F5EFE3]">Recent Leaves</h3>
            <p className="text-[13px] text-[#6E675D] truncate">Living community feed</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {recent.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className="w-full rounded-xl bg-[#22201D] p-5 flex flex-col text-left overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#E8B45A] bg-[#181714] px-2 py-0.5 rounded-full">
                  {LABELS[item.category] || item.category}
                </span>
                <span className="text-[11px] text-[#6E675D] shrink-0">{item.createdAt}</span>
              </div>
              {item.images[0] ? (
                <div className="w-full h-32 rounded-lg overflow-hidden bg-[#181714] mt-3">
                  <img
                    src={item.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : item.metadata?.goldenQuote ? (
                <div className="w-full h-32 rounded-lg bg-[#181714] p-3 flex flex-col justify-center mt-3">
                  <p className="font-editorial text-[20px] text-[#A8A196] italic line-clamp-3">
                    “{item.metadata.goldenQuote}”
                  </p>
                </div>
              ) : null}
              {item.content ? (
                <p className="text-[13px] leading-5 text-[#A8A196] line-clamp-2 mt-1">{item.content}</p>
              ) : item.category === 'recipes' && item.metadata?.ingredients?.length ? (
                <p className="text-[12px] leading-5 text-[#E8B45A]/90 mt-1">{item.metadata.ingredients.length} ingredients</p>
              ) : null}
              <div className="flex items-center gap-2 pt-3 mt-3 min-w-0">
                <img
                  src={item.author.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="text-[13px] text-[#F5EFE3] truncate">{item.author.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
