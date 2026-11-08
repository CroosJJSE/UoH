import React, { useState } from 'react';
import { ArchiveItem, CommunityMember, recipeDescription } from '../types';
import { X, Music2, Check, Copy } from 'lucide-react';

interface ItemDetailModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
  onEdit?: (item: ArchiveItem) => void;
  onDelete?: (item: ArchiveItem) => void;
  currentUser: CommunityMember;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
  currentUser,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!item) return null;

  const canManage =
    item.authorId === currentUser.id || currentUser.role === 'ADMIN' || currentUser.role === 'MASTER_ADMIN';
  const canEdit = item.authorId === currentUser.id;
  const isSong = item.category === 'museum' && item.subCategory === 'songs';

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#111210]/90 backdrop-blur-md flex justify-center overflow-x-hidden">
      <div className="relative w-full max-w-[430px] h-dvh bg-[#181714] p-5 text-[#F5EFE3] overflow-y-auto overflow-x-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#22201D] text-[#A8A196] hover:text-[#F5EFE3] border border-[#2E2A25] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#A8A196] mb-3">
          <span className="text-[#E8B45A] font-semibold uppercase tracking-wider">
            {item.category.replace('_', ' ')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{item.subCategory?.replace('_', ' ') || 'Archive Record'}</span>
          <span aria-hidden="true">·</span>
          <span>Preserved {item.createdAt}</span>
        </div>

        {/* Title */}
        <h2 className="font-editorial text-2xl sm:text-3xl text-[#F5EFE3] font-medium leading-tight mb-4">
          {item.title}
        </h2>

        {/* Contributor Row */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#22201D] border border-[#2E2A25] mb-6">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E8B45A]/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6E675D]">Documented by:</span>
              <span className="text-sm font-semibold text-[#F5EFE3]">{item.author.name}</span>
            </div>
            <p className="text-xs text-[#A8A196]">{item.author.fellowshipYear || 'Fellowship Member'}</p>
          </div>
        </div>

        {/* Media / Image Display */}
        {item.images && item.images.length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden border border-[#2E2A25] bg-[#111210]">
            <img
              src={item.images[0]}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[500px] object-cover"
            />
            {item.metadata?.medium && (
              <p className="p-3 text-xs text-[#A8A196] italic bg-[#111210] border-t border-[#2E2A25]">
                Medium: {item.metadata.medium}
              </p>
            )}
          </div>
        )}

        {/* Song in Alexa Special Callout */}
        {isSong && item.metadata && (
          <div className="mb-8 p-5 rounded-xl bg-[#22201D] border border-[#2E2A25] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#E8B45A] font-semibold">
                <Music2 className="w-4 h-4" />
                <span>Living Room Alexa Favorite</span>
              </div>
              {item.metadata.artist && (
                <span className="text-xs text-[#A8A196]">Artist: <strong className="text-[#F5EFE3]">{item.metadata.artist}</strong></span>
              )}
            </div>

            {item.metadata.alexaPrompt && (
              <div className="p-3 rounded-lg bg-[#181714] border border-[#2E2A25] flex items-center justify-between gap-3">
                <div className="font-mono text-xs text-[#E8B45A]">
                  &ldquo;{item.metadata.alexaPrompt}&rdquo;
                </div>
                <button
                  onClick={() => handleCopyPrompt(item.metadata!.alexaPrompt!)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#A8A196] hover:text-[#F5EFE3] bg-[#22201D] rounded border border-[#2E2A25] cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Command'}</span>
                </button>
              </div>
            )}

            {item.metadata.lyricsSnippet && (
              <div className="p-3 rounded-lg bg-[#181714] border-l-2 border-[#E8B45A] text-xs text-[#d3c4b2] italic leading-relaxed whitespace-pre-line">
                {item.metadata.lyricsSnippet}
              </div>
            )}

            {item.metadata.houseMemory && (
              <p className="text-xs text-[#A8A196] leading-relaxed">
                <strong className="text-[#F5EFE3]">House Memory:</strong> {item.metadata.houseMemory}
              </p>
            )}
          </div>
        )}

        {(item.category === 'recipes' ? recipeDescription(item) : item.content) && (
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-sm sm:text-base text-[#F5EFE3]/90 leading-relaxed whitespace-pre-line">
              {item.category === 'recipes' ? recipeDescription(item) : item.content}
            </p>
          </div>
        )}

        {canManage && (
          <div className="flex items-center justify-end gap-3 mb-6">
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="px-3 py-1.5 rounded-md text-xs text-[#E8B45A] border border-[#2E2A25] cursor-pointer"
              >
                Edit contribution
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="px-3 py-1.5 rounded-md text-xs text-[#ffb4ab] cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
