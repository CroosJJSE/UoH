import React, { useEffect, useRef, useState } from 'react';
import { ArchiveItem, CommunityMember, ContributionDraft, recipeDescription } from '../types';
import { X, Upload, UtensilsCrossed, Palette, HeartHandshake, Image as ImageIcon } from 'lucide-react';
import { isCloudinaryConfigured, uploadImage } from '../services/cloudinary';
import { toUserMessage } from '../lib/errors';

type ComposerDraft = {
  id?: string;
  category: 'museum' | 'recipes' | 'memories' | 'wisdom';
  subCategory: string;
  title: string;
  content: string;
  imagePreview: string;
  goldenQuote: string;
  lifePrinciple: string;
};

function draftStorageKey(userId: string) {
  return `uoh-composer-draft:${userId}`;
}

function readComposerDraft(userId: string): ComposerDraft | null {
  try {
    const raw = localStorage.getItem(draftStorageKey(userId));
    return raw ? (JSON.parse(raw) as ComposerDraft) : null;
  } catch {
    return null;
  }
}

function writeComposerDraft(userId: string, draft: ComposerDraft) {
  try {
    localStorage.setItem(draftStorageKey(userId), JSON.stringify(draft));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function clearComposerDraft(userId: string) {
  try {
    localStorage.removeItem(draftStorageKey(userId));
  } catch {
    // Ignore storage failures.
  }
}

interface AddArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draft: ContributionDraft, existingId?: string) => Promise<string | void>;
  currentUser: CommunityMember;
  editingItem?: ArchiveItem | null;
}

export const AddArchiveModal: React.FC<AddArchiveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUser,
  editingItem,
}) => {
  const [category, setCategory] = useState<'museum' | 'recipes' | 'memories' | 'wisdom'>('recipes');
  const [subCategory, setSubCategory] = useState<string>('mains');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goldenQuote, setGoldenQuote] = useState('');
  const [lifePrinciple, setLifePrinciple] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const draftIdRef = useRef<string | null>(null);
  const savingRef = useRef<Promise<string | void> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const composeLocalDraft = (): ComposerDraft => ({
    id: draftIdRef.current ?? undefined,
    category,
    subCategory,
    title,
    content,
    imagePreview: imagePreview.startsWith('https://') ? imagePreview : '',
    goldenQuote,
    lifePrinciple,
  });

  const composeContributionDraft = (): ContributionDraft => {
    const metadata: ArchiveItem['metadata'] = { ...(editingItem?.metadata ?? {}) };
    if (category === 'museum' && subCategory === 'songs') {
      metadata.songTitle = title;
    } else if (category === 'wisdom') {
      metadata.goldenQuote = goldenQuote || undefined;
      metadata.lifePrinciple = lifePrinciple || undefined;
    }

    return {
      category,
      subCategory,
      title,
      content,
      images: imagePreview.startsWith('https://') ? [imagePreview] : [],
      metadata,
    };
  };

  useEffect(() => {
    if (!isOpen) {
      setHydrated(false);
      return;
    }
    const item = editingItem;
    const saved = !item ? readComposerDraft(currentUser.id) : null;
    draftIdRef.current = item?.id ?? saved?.id ?? null;
    setCategory(item?.category ?? saved?.category ?? 'recipes');
    setSubCategory(
      item?.subCategory ?? saved?.subCategory ?? (item?.category === 'museum' ? 'art' : 'mains')
    );
    setTitle(item?.title ?? saved?.title ?? '');
    setContent(item ? recipeDescription(item) : saved?.content ?? '');
    setImagePreview(item?.images?.[0] ?? (saved?.imagePreview?.startsWith('https://') ? saved.imagePreview : '') ?? '');
    setImageFile(null);
    setGoldenQuote(item?.metadata?.goldenQuote ?? saved?.goldenQuote ?? '');
    setLifePrinciple(item?.metadata?.lifePrinciple ?? saved?.lifePrinciple ?? '');
    setError(null);
    setHydrated(true);
  }, [isOpen, editingItem, currentUser.id]);

  useEffect(() => {
    if (!isOpen || !hydrated || editingItem) return;
    const timer = window.setTimeout(() => {
      writeComposerDraft(currentUser.id, composeLocalDraft());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [
    isOpen,
    hydrated,
    editingItem,
    currentUser.id,
    category,
    subCategory,
    title,
    content,
    imagePreview,
    goldenQuote,
    lifePrinciple,
  ]);

  const contentRequired = category === 'recipes';

  useEffect(() => {
    if (!isOpen || !hydrated) return;
    if (!title.trim()) return;
    if (contentRequired && !content.trim()) return;

    const timer = window.setTimeout(() => {
      const run = Promise.resolve(savingRef.current).then(async () => {
        const id = await onSaveRef.current(
          composeContributionDraft(),
          draftIdRef.current ?? editingItem?.id ?? undefined
        );
        if (id) {
          draftIdRef.current = id;
          writeComposerDraft(currentUser.id, composeLocalDraft());
        }
        return id;
      });
      savingRef.current = run;
      void run.finally(() => {
        if (savingRef.current === run) savingRef.current = null;
      });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [
    isOpen,
    hydrated,
    editingItem,
    currentUser.id,
    category,
    subCategory,
    title,
    content,
    imagePreview,
    goldenQuote,
    lifePrinciple,
    contentRequired,
  ]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (contentRequired && !content.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await Promise.resolve(savingRef.current);
      const draft = composeContributionDraft();
      if (imageFile) {
        draft.images = [await uploadImage(imageFile)];
      }

      const id = await onSave(draft, draftIdRef.current ?? editingItem?.id ?? undefined);
      if (id) draftIdRef.current = id;
      if (!editingItem) clearComposerDraft(currentUser.id);
      onClose();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#111210]/90 backdrop-blur-md flex justify-center overflow-x-hidden">
      <div className="relative w-full max-w-[430px] h-dvh bg-[#181714] p-5 text-[#F5EFE3] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2A25] mb-6">
          <div>
            <h3 className="font-editorial text-2xl font-medium text-[#F5EFE3]">
              {editingItem ? 'Revise Archive Record' : 'Be merciful'}
            </h3>
            <p className="text-xs text-[#A8A196] mt-0.5">
              Contributing as <strong className="text-[#E8B45A]">{currentUser.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8A196] hover:text-[#F5EFE3] hover:bg-[#22201D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Picker Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A196] mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('recipes');
                  setSubCategory('mains');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  category === 'recipes'
                    ? 'bg-[#22201D] border-[#E8B45A] text-[#E8B45A]'
                    : 'bg-[#181714] border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 shrink-0" />
                <span>Recipe Book</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('museum');
                  setSubCategory('art');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  category === 'museum'
                    ? 'bg-[#22201D] border-[#E8B45A] text-[#E8B45A]'
                    : 'bg-[#181714] border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3]'
                }`}
              >
                <Palette className="w-4 h-4 shrink-0" />
                <span>Museum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('memories');
                  setSubCategory('gatherings');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  category === 'memories'
                    ? 'bg-[#22201D] border-[#E8B45A] text-[#E8B45A]'
                    : 'bg-[#181714] border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3]'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Memory Album</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('wisdom');
                  setSubCategory('golden_advice');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  category === 'wisdom'
                    ? 'bg-[#22201D] border-[#E8B45A] text-[#E8B45A]'
                    : 'bg-[#181714] border-[#2E2A25] text-[#A8A196] hover:text-[#F5EFE3]'
                }`}
              >
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span>Wisdom</span>
              </button>
            </div>
          </div>

          {/* Museum subcategories */}
          {category === 'museum' && (
            <div className="flex items-center gap-2 p-1 bg-[#111210] rounded-lg border border-[#2E2A25] w-fit text-xs">
              <button
                type="button"
                onClick={() => setSubCategory('art')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  subCategory === 'art' ? 'bg-[#22201D] text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
                }`}
              >
                Art & Drawing
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('articles')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  subCategory === 'articles' ? 'bg-[#22201D] text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
                }`}
              >
                Article
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('songs')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  subCategory === 'songs' ? 'bg-[#22201D] text-[#E8B45A] font-semibold' : 'text-[#A8A196]'
                }`}
              >
                Song in Alexa
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs text-[#A8A196] mb-1">
              {category === 'recipes'
                ? 'Recipe Name *'
                : subCategory === 'songs'
                ? 'Song Title *'
                : 'Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'recipes'
                  ? 'e.g. Sabbath Slow-Claypot Stew'
                  : subCategory === 'songs'
                  ? 'e.g. Be Thou My Vision'
                  : 'e.g. Peace at the Table'
              }
              className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A8A196] mb-1">
              {category === 'recipes'
                ? 'Description *'
                : subCategory === 'songs'
                ? 'Why this song matters at Hathbodhiya'
                : 'Reflection & Description'}
            </label>
            <textarea
              required={contentRequired}
              rows={category === 'recipes' ? 8 : 4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                category === 'recipes'
                  ? 'Write the recipe — ingredients, how you cook it, or any notes...'
                  : 'Write the reflection or memory...'
              }
              className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Wisdom fields */}
          {category === 'wisdom' && (
            <div className="space-y-3 p-4 rounded-xl bg-[#111210] border border-[#2E2A25]">
              <div>
                <label className="block text-[11px] text-[#A8A196] mb-1">Golden Quote</label>
                <input
                  type="text"
                  value={goldenQuote}
                  onChange={(e) => setGoldenQuote(e.target.value)}
                  placeholder="e.g. The Cross cancelled the balance sheet."
                  className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A8A196] mb-1">Core Takeaway</label>
                <input
                  type="text"
                  value={lifePrinciple}
                  onChange={(e) => setLifePrinciple(e.target.value)}
                  placeholder="e.g. Rest in Christ before striving."
                  className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-[#A8A196] mb-2">
              Attach Photograph or Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#2E2A25] hover:border-[#E8B45A]/50 rounded-xl cursor-pointer bg-[#181714] transition-colors">
                <Upload className="w-5 h-5 text-[#E8B45A] mb-1.5" />
                <span className="text-xs text-[#F5EFE3] font-medium">Click to upload photo</span>
                <span className="text-[10px] text-[#6E675D]">JPG, PNG, or WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#2E2A25] shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-[#111210]/90 text-[#ffb4ab] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-xs text-[#ffb4ab]">{error}</p>}
          {!isCloudinaryConfigured() && (
            <p className="text-[11px] text-[#6E675D]">
              Image upload requires Cloudinary unsigned preset variables. You can still preserve text-only records.
            </p>
          )}

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#2E2A25] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#A8A196] hover:text-[#F5EFE3] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              {busy ? 'Saving…' : editingItem ? 'Save revisions' : 'Preserve in Archive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
