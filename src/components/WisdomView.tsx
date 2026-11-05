import React, { useState } from 'react';
import { ArchiveItem } from '../types';
import { Quote, Star, MessageSquare, Plus, BookOpen } from 'lucide-react';

interface WisdomViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserEmail: string;
  onOpenAddModal: () => void;
}

export const WisdomView: React.FC<WisdomViewProps> = ({
  items,
  onSelect,
  onStar,
  currentUserEmail,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'faith_perspective' | 'hospitality' | 'golden_advice'>('all');

  const wisdomItems = items.filter((i) => i.category === 'wisdom');
  const filteredWisdom = wisdomItems.filter((i) => {
    if (filter === 'all') return true;
    return i.subCategory === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#2E2A25]">
        <div>
          <div className="text-xs text-[#E8B45A] font-semibold tracking-wide uppercase mb-1">
            Enduring Truths
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE3] font-medium">
            Things We Don't Want to Forget
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
            Golden counsels, perspectives of God and Christian discipleship, and principles of unconditional love spoken quietly over cups of tea.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Record a Lesson</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#181714] border border-[#2E2A25] rounded-lg w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          All Guidance ({wisdomItems.length})
        </button>
        <button
          onClick={() => setFilter('faith_perspective')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            filter === 'faith_perspective'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          Perspectives of God
        </button>
        <button
          onClick={() => setFilter('hospitality')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            filter === 'hospitality'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          Hospitality & Love
        </button>
        <button
          onClick={() => setFilter('golden_advice')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            filter === 'golden_advice'
              ? 'bg-[#22201D] text-[#E8B45A] shadow-sm'
              : 'text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          Life Principles
        </button>
      </div>

      {/* Wisdom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWisdom.map((item) => {
          const isStarred = item.starredBy.includes(currentUserEmail);

          return (
            <div
              key={item.id}
              className="group p-6 sm:p-7 rounded-2xl bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] hover:border-[#423D35] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Unboxed category metadata */}
                <div className="flex items-center gap-2 text-xs text-[#E8B45A] font-medium mb-3">
                  <Quote className="w-3.5 h-3.5" />
                  <span className="capitalize">{item.subCategory?.replace('_', ' ') || 'Guidance'}</span>
                  <span aria-hidden="true" className="text-[#6E675D]">·</span>
                  <span className="text-[#A8A196]">Preserved for Generations</span>
                </div>

                <h3
                  onClick={() => onSelect(item)}
                  className="font-editorial text-2xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium leading-tight cursor-pointer"
                  style={{ textWrap: 'balance' }}
                >
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="font-editorial text-sm text-[#E8B45A]/90 italic mt-1 mb-3">
                    {item.subtitle}
                  </p>
                )}

                {/* Golden Pull-Quote style callout */}
                {item.metadata?.goldenQuote && (
                  <div className="my-4 py-3 px-4 rounded-lg bg-[#181714] border-l-2 border-[#E8B45A] text-sm text-[#F5EFE3] font-editorial italic leading-relaxed">
                    &ldquo;{item.metadata.goldenQuote}&rdquo;
                  </div>
                )}

                <p className="text-sm text-[#A8A196] leading-relaxed line-clamp-4">
                  {item.content}
                </p>

                {item.metadata?.lifePrinciple && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#d3c4b2]">
                    <BookOpen className="w-3.5 h-3.5 text-[#E8B45A] shrink-0" />
                    <span><strong className="text-[#E8B45A]">Takeaway:</strong> {item.metadata.lifePrinciple}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-[#2E2A25] flex items-center justify-between text-xs text-[#A8A196]">
                <div className="flex items-center gap-2">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs text-[#A8A196]">Shared by {item.author.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStar(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
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
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-[#A8A196] hover:text-[#F5EFE3] transition-colors cursor-pointer"
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
