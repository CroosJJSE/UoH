import React from 'react';
import { ArchiveItem } from '../types';
import { Heart, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ArchiveMedia } from './ArchiveMedia';

interface FeaturedMemoryProps {
  item: ArchiveItem;
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  isStarred: boolean;
}

export const FeaturedMemory: React.FC<FeaturedMemoryProps> = ({
  item,
  onSelect,
  onStar,
  isStarred,
}) => {
  const hasImage = item.images && item.images.length > 0;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#181714] border border-[#2E2A25] p-6 sm:p-8 lg:p-10 mb-12 shadow-2xl transition-all">
      {/* Subtle ambient warm backlight */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E8B45A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Curatorial Essay & Headline */}
        <div className={hasImage ? 'lg:col-span-7 space-y-5' : 'lg:col-span-12 space-y-5'}>
          {/* Unboxed metadata line with typographic bullet separators */}
          <div className="flex items-center gap-2 text-xs text-[#A8A196]">
            <span className="text-[#E8B45A] font-semibold tracking-wide">Featured From Hathbodhiya</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{item.category.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Recorded {item.createdAt}</span>
          </div>

          <h2
            onClick={() => onSelect(item)}
            className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#F5EFE3] hover:text-[#E8B45A] cursor-pointer transition-colors leading-tight font-medium"
            style={{ textWrap: 'balance' }}
          >
            {item.title}
          </h2>



          <p className="text-sm sm:text-base text-[#A8A196] leading-relaxed line-clamp-4">
            {item.content}
          </p>

          {/* Action Row & Contributor */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#2E2A25]">
            <div className="flex items-center gap-3">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#2E2A25]"
              />
              <div className="text-xs">
                <p className="text-[#F5EFE3] font-medium">{item.author.name}</p>
                <p className="text-[#6E675D]">{item.author.fellowshipYear || 'Fellowship Community'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStar(item.id)}
                aria-label="Cherish offering"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  isStarred
                    ? 'bg-[#E8B45A]/15 border-[#E8B45A] text-[#E8B45A]'
                    : 'bg-[#22201D] border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3] hover:border-[#423D35]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#E8B45A]' : ''}`} />
              </button>

              <button
                onClick={() => onSelect(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#22201D] border border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3] hover:border-[#423D35] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="tabular-nums">{item.commentsCount}</span>
              </button>

              <button
                onClick={() => onSelect(item)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-md text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] transition-colors cursor-pointer shrink-0"
              >
                <span>Read Full Memory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        {hasImage && (
          <div
            onClick={() => onSelect(item)}
            className="lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-xl border border-[#2E2A25] shadow-lg"
          >
            <div className="aspect-4/3 w-full overflow-hidden bg-[#22201D]">
              <ArchiveMedia
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111210]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs text-[#E8B45A] font-medium flex items-center gap-1">
                View in detail &rarr;
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
