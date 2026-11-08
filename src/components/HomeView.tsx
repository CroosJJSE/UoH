import { ArchiveItem, CategoryType, CommunityMember, recipeDescription } from '../types';
import { NotebookPen, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
  const greetings = [
    `කෑම කන්න එන්න, ${firstName}`,
    `${firstName} did you read my article?`,
    `${firstName} What God spoke to you today?`,
  ];
  const featured = items.find((item) => item.images.length > 0) ?? items[0];
  const quoteItem = items.find((item) => item.category === 'wisdom' && item.metadata?.goldenQuote);
  const recent = items.slice(0, 2);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingVisible, setGreetingVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  useEffect(() => {
    let timeout: number | undefined;
    const interval = window.setInterval(() => {
      setGreetingVisible(false);
      timeout = window.setTimeout(() => {
        setGreetingIndex((index) => (index + 1) % greetings.length);
        setGreetingVisible(true);
      }, 280);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [greetings.length]);
  return (
    <div className="flex flex-col w-full gap-8">
      <section className="relative w-full overflow-hidden rounded-xl bg-[#181714] shadow-md">
          {/* Background video */}
          <video
            src="/door_locking.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full aspect-[16/10] object-cover object-center"
            ref={videoRef}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />

          {/* Quote */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7">
            <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#F5EFE3] leading-snug">
              Door locks automatically.
              <br />
              <span className="text-[#E8B45A] italic">
                Hearts open automatically.
              </span>
            </p>
          </div>
      </section>

      <section className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B45A] animate-pulse" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#E8B45A]">
            The Hathbodhiya Journal
          </span>
        </div>
        <h2
          className={`font-editorial text-[20px] leading-7 text-[#F5EFE3] transition-opacity duration-300 ${
            greetingVisible ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          {greetings[greetingIndex]}
        </h2>
        <p className="text-[13px] leading-5 text-[#A8A196]">
        Dinner table will be closed at 8:00 PM.
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
                Hey Alexa play......
              </h1>
              <p className="text-[15px] leading-6 text-[#A8A196]">
                Everybody loves somebody
              </p>
            </div>
          </button>
        </section>
      )}



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
              ) : item.category === 'recipes' && recipeDescription(item) ? (
                <p className="text-[13px] leading-5 text-[#A8A196] line-clamp-2 mt-1">{recipeDescription(item)}</p>
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
