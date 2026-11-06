import React, { useState } from 'react';
import { ArchiveItem, CommunityMember } from '../types';
import { X, Star, MessageSquare, Clock, Users, Sparkles, Music2, Check, Copy } from 'lucide-react';

interface ItemDetailModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
  onStar: (itemId: string) => void;
  onAddComment: (itemId: string, text: string) => void;
  onEdit?: (item: ArchiveItem) => void;
  onDelete?: (item: ArchiveItem) => void;
  currentUser: CommunityMember;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onStar,
  onAddComment,
  onEdit,
  onDelete,
  currentUser,
}) => {
  const [commentText, setCommentText] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!item) return null;

  const isStarred = item.starredBy.includes(currentUser.id);
  const canManage =
    item.authorId === currentUser.id || currentUser.role === 'ADMIN' || currentUser.role === 'MASTER_ADMIN';
  const canEdit = item.authorId === currentUser.id;
  const isRecipe = item.category === 'recipes';
  const isSong = item.category === 'museum' && item.subCategory === 'songs';

  const handleToggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(item.id, commentText.trim());
    setCommentText('');
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
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#F5EFE3] font-medium leading-tight mb-2">
          {item.title}
        </h2>

        {item.subtitle && (
          <p className="font-editorial text-lg text-[#E8B45A] italic mb-6">
            {item.subtitle}
          </p>
        )}

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
          <div className="mb-8 rounded-xl overflow-hidden border border-[#2E2A25] bg-[#111210]">
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

        {/* Main Content Prose */}
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-sm sm:text-base text-[#F5EFE3]/90 leading-relaxed whitespace-pre-line">
            {item.content}
          </p>
        </div>

        {/* Recipe Specific Sections: Ingredients & Steps */}
        {isRecipe && item.metadata && (
          <div className="mb-8 space-y-6 p-6 rounded-xl bg-[#22201D] border border-[#2E2A25]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#2E2A25]">
              <h3 className="font-editorial text-2xl text-[#F5EFE3] font-medium">
                Cooking Instructions
              </h3>
              <div className="flex items-center gap-4 text-xs text-[#A8A196]">
                {item.metadata.prepTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E8B45A]" />
                    <span>{item.metadata.prepTime}</span>
                  </span>
                )}
                {item.metadata.servings && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E8B45A]" />
                    <span>{item.metadata.servings}</span>
                  </span>
                )}
              </div>
            </div>

            {/* The Secret Touch */}
            {item.metadata.secretTouch && (
              <div className="p-4 rounded-lg bg-[#181714] border border-[#E8B45A]/40 text-xs text-[#A8A196]">
                <div className="flex items-center gap-1.5 text-[#E8B45A] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Hathbodhiya Secret Touch</span>
                </div>
                <p className="italic text-[#F5EFE3] leading-relaxed">
                  &ldquo;{item.metadata.secretTouch}&rdquo;
                </p>
              </div>
            )}

            {/* Ingredients with interactive checkboxes */}
            {item.metadata.ingredients && item.metadata.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E8B45A] mb-3">
                  Ingredients (Tap to check off while cooking)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.metadata.ingredients.map((ing, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleIngredient(idx)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#181714] opacity-50 line-through' : 'hover:bg-[#2B2824]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#E8B45A] border-[#E8B45A] text-[#111210]'
                              : 'border-[#423D35]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs text-[#F5EFE3]">{ing}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preparation Steps */}
            {item.metadata.steps && item.metadata.steps.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E8B45A] mb-3">
                  Step-by-Step Method
                </h4>
                <ol className="space-y-3">
                  {item.metadata.steps.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#A8A196] leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-[#181714] border border-[#2E2A25] text-[#E8B45A] font-semibold text-xs flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Stars Action Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#22201D] border border-[#2E2A25] mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#E8B45A] text-[#E8B45A]" />
            <span className="text-sm font-semibold text-[#F5EFE3] tabular-nums">
              {item.starsCount} community stars received
            </span>
          </div>

          <button
            onClick={() => onStar(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isStarred
                ? 'bg-[#E8B45A] text-[#111210]'
                : 'bg-[#181714] text-[#E8B45A] border border-[#E8B45A] hover:bg-[#E8B45A] hover:text-[#111210]'
            }`}
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-[#111210]' : ''}`} />
            <span>{isStarred ? 'Starred with Gratitude' : 'Give a Star'}</span>
          </button>
        </div>

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

        {/* Community Comments & Reflections */}
        <div className="space-y-6 pt-4 border-t border-[#2E2A25]">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl text-[#F5EFE3] font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#E8B45A]" />
              <span>Fellowship Reflections ({item.commentsCount})</span>
            </h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-1 ring-[#E8B45A]"
              />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Write a reflection or memory as ${currentUser.name}...`}
                  className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none leading-relaxed"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Post Reflection
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {item.comments.length === 0 ? (
              <p className="text-xs text-[#6E675D] italic">
                No reflections added yet. Be the first to share your thoughts on this memory.
              </p>
            ) : (
              item.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl bg-[#22201D] border border-[#2E2A25] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium text-[#F5EFE3]">{comment.authorName}</span>
                    </div>
                    <span className="text-[#6E675D]">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed pl-7">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
