import React, { useState } from 'react';
import { ArchiveItem } from '../types';
import { Palette, FileText, Music2, Star, MessageSquare, Plus } from 'lucide-react';

interface MuseumViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserEmail: string;
  onOpenAddModal: () => void;
}

export const MuseumView: React.FC<MuseumViewProps> = ({
  items,
  onSelect,
  onStar,
  currentUserEmail,
  onOpenAddModal,
}) => {
  const [subFilter, setSubFilter] = useState<'all' | 'art' | 'articles' | 'songs'>('all');

  const filteredItems = items.filter((item) => {
    if (item.category !== 'museum') return false;
    if (subFilter === 'all') return true;
    return item.subCategory === subFilter;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#2E2A25]">
        <div>
          <div className="text-xs text-[#E8B45A] font-semibold tracking-wide uppercase mb-1">
            Archival Collection
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE3] font-medium">
            The Museum
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
            Preserving hand-drawn art, essays on biblical grace and life perspective, and the songs played through Alexa in the living room.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Work or Song</span>
        </button>
      </div>

      {/* Subcategory Filter Tabs (Interactive buttons) */}
      <div className="flex items-center gap-2 p-1 bg-[#181714] border border-[#2E2A25] rounded-lg w-fit">
        <button
          onClick={() => setSubFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            subFilter === 'all'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          All Collections ({items.filter((i) => i.category === 'museum').length})
        </button>
        <button
          onClick={() => setSubFilter('art')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            subFilter === 'art'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Art & Sketches</span>
        </button>
        <button
          onClick={() => setSubFilter('articles')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            subFilter === 'articles'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Articles & Writings</span>
        </button>
        <button
          onClick={() => setSubFilter('songs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            subFilter === 'songs'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" />
          <span>Songs in Alexa</span>
        </button>
      </div>

      {/* Main Grid / Layout */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-[#181714] border border-[#2E2A25]">
          <p className="font-editorial text-lg text-[#F5EFE3]">No entries found in this collection</p>
          <p className="text-xs text-[#A8A196] mt-1">Be the first to document an artwork, essay, or song from the house.</p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#111210] bg-[#E8B45A] rounded-md hover:bg-[#D4A045] transition-colors"
          >
            Add an item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isStarred = item.starredBy.includes(currentUserEmail);
            const isSong = item.subCategory === 'songs';
            const isArt = item.subCategory === 'art';
            const hasImage = item.images && item.images.length > 0;

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-xl bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] hover:border-[#423D35] transition-all overflow-hidden"
              >
                <div>
                  {/* Image Display for Art / Illustrated posts */}
                  {hasImage ? (
                    <div
                      onClick={() => onSelect(item)}
                      className="aspect-4/3 w-full overflow-hidden bg-[#181714] relative cursor-pointer"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      {item.metadata?.medium && (
                        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-[#111210]/90 backdrop-blur-sm border border-[#2E2A25] text-[11px] text-[#A8A196] truncate">
                          {item.metadata.medium}
                        </div>
                      )}
                    </div>
                  ) : isSong ? (
                    /* Dedicated tactile card styling for songs in Alexa */
                    <div
                      onClick={() => onSelect(item)}
                      className="p-5 pb-3 bg-[#181714] border-b border-[#2E2A25] cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs text-[#E8B45A] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Music2 className="w-3.5 h-3.5" />
                          <span>Hymn & Song Record</span>
                        </span>
                        <span className="text-[#6E675D] font-mono text-[11px]">Living Room Alexa</span>
                      </div>
                      {item.metadata?.alexaPrompt && (
                        <div className="p-2.5 rounded bg-[#22201D] border border-[#2E2A25] text-xs font-mono text-[#F5EFE3]/90 italic mb-2">
                          &ldquo;{item.metadata.alexaPrompt}&rdquo;
                        </div>
                      )}
                      {item.metadata?.artist && (
                        <p className="text-xs text-[#A8A196]">
                          Artist / Composer: <span className="text-[#F5EFE3] font-medium">{item.metadata.artist}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Article header display */
                    <div
                      onClick={() => onSelect(item)}
                      className="p-5 pb-2 bg-[#181714] border-b border-[#2E2A25] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#A8A196]">
                        <span className="text-[#E8B45A] font-semibold">Essay & Reflection</span>
                        {item.metadata?.readingTime && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.metadata.readingTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5">
                    <h3
                      onClick={() => onSelect(item)}
                      className="font-editorial text-xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium leading-snug cursor-pointer"
                      style={{ textWrap: 'balance' }}
                    >
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="font-editorial text-xs sm:text-sm text-[#E8B45A]/90 italic mt-1 mb-2">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed line-clamp-3 mt-2">
                      {item.content}
                    </p>

                    {/* Scripture or Memory Quote if available */}
                    {item.metadata?.scriptureVerse && (
                      <p className="text-[11px] text-[#A8A196]/80 italic mt-3 border-l border-[#E8B45A]/30 pl-2">
                        {item.metadata.scriptureVerse}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Author + Star/Comment actions */}
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
                      title={isStarred ? 'You starred this' : 'Star this item'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#E8B45A]' : ''}`} />
                      <span className="tabular-nums">{item.starsCount}</span>
                    </button>

                    <button
                      onClick={() => onSelect(item)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#A8A196] hover:text-[#F5EFE3] transition-colors cursor-pointer"
                      title="Read comments"
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
      )}
    </div>
  );
};
