import React, { useState } from 'react';
import { ArchiveItem } from '../types';
import { Camera, Calendar, Star, MessageSquare, Plus, Maximize2, X } from 'lucide-react';

interface AlbumsViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserEmail: string;
  onOpenAddModal: () => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  items,
  onSelect,
  onStar,
  currentUserEmail,
  onOpenAddModal,
}) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const memoryItems = items.filter((i) => i.category === 'memories');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#2E2A25]">
        <div>
          <div className="text-xs text-[#E8B45A] font-semibold tracking-wide uppercase mb-1">
            Visual Chronicles
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE3] font-medium">
            Memory Albums
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
            Snapshots of fellowship dinners, kitchen cleanups, quiet corners of prayer, and faces of brothers and sisters whose lives were blessed here.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload Memory Photo</span>
        </button>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {memoryItems.map((item) => {
          const isStarred = item.starredBy.includes(currentUserEmail);
          const hasImage = item.images && item.images.length > 0;

          return (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#22201D] border border-[#2E2A25] hover:border-[#423D35] transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo frame with zoom affordance */}
                {hasImage && (
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#181714]">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <button
                      onClick={() => setLightboxImage(item.images[0])}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-[#111210]/80 text-[#F5EFE3] hover:text-[#E8B45A] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Enlarge photograph"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#A8A196] mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#E8B45A]" />
                    <span>{item.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{item.subCategory?.replace('_', ' ') || 'Fellowship Moment'}</span>
                  </div>

                  <h3
                    onClick={() => onSelect(item)}
                    className="font-editorial text-2xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium leading-snug cursor-pointer"
                    style={{ textWrap: 'balance' }}
                  >
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="font-editorial text-sm text-[#E8B45A]/90 italic mt-1 mb-2">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="text-sm text-[#A8A196] leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#2E2A25] flex items-center justify-between text-xs text-[#A8A196]">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[#F5EFE3] font-medium">{item.author.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#111210]/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-xl border border-[#2E2A25]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#111210]/80 text-[#F5EFE3] hover:text-[#E8B45A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged view"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
