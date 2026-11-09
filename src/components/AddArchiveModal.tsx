import React, { useEffect, useRef, useState } from 'react';
import { ArchiveItem, CommunityMember, ContributionDraft, recipeDescription } from '../types';
import { X, Upload, UtensilsCrossed, Palette, HeartHandshake, Image as ImageIcon, Loader2 } from 'lucide-react';
import { isCloudinaryConfigured, uploadMedia } from '../services/cloudinary';
import { ensureAuthSession } from '../services/auth';
import { toUserMessage } from '../lib/errors';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_TOO_LARGE_MESSAGE,
} from '../lib/constants';
import { isVideoUrl } from '../lib/media';
import { ArchiveMedia } from './ArchiveMedia';

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
  const [mediaKind, setMediaKind] = useState<'image' | 'video'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [goldenQuote, setGoldenQuote] = useState('');
  const [lifePrinciple, setLifePrinciple] = useState('');

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
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.removeItem(`uoh-composer-open:${currentUser.id}`);
    } catch {
      // Ignore storage failures.
    }
    const item = editingItem;
    setCategory(item?.category ?? 'recipes');
    setSubCategory(item?.subCategory ?? (item?.category === 'museum' ? 'art' : 'mains'));
    setTitle(item?.title ?? '');
    setContent(item ? recipeDescription(item) : '');
    const preview = item?.images?.[0] ?? '';
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreview(preview);
    setMediaKind(isVideoUrl(preview) ? 'video' : 'image');
    setImageFile(null);
    setGoldenQuote(item?.metadata?.goldenQuote ?? '');
    setLifePrinciple(item?.metadata?.lifePrinciple ?? '');
    setUploadPercent(null);
    setError(null);
  }, [isOpen, editingItem, currentUser.id]);

  const contentRequired = category === 'recipes';

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const video = ALLOWED_VIDEO_TYPES.includes(file.type as (typeof ALLOWED_VIDEO_TYPES)[number]);
    const image = ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number]);
    if (!video && !image) {
      setError('Please choose a JPG, PNG, WebP, GIF, MP4, WebM, or MOV file.');
      return;
    }
    if (video && file.size > MAX_VIDEO_BYTES) {
      setError(VIDEO_TOO_LARGE_MESSAGE);
      return;
    }
    if (image && file.size > MAX_IMAGE_BYTES) {
      setError('Images must be 8 MB or smaller.');
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setError(null);
    setImageFile(file);
    setMediaKind(video ? 'video' : 'image');
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (contentRequired && !content.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await ensureAuthSession();
      const draft = composeContributionDraft();
      if (imageFile) {
        setUploadPercent(0);
        draft.images = [await uploadMedia(imageFile, setUploadPercent)];
      }

      await onSave(draft, editingItem?.id);
      onClose();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
      setUploadPercent(null);
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
              Attach a photo or video (optional)
            </label>
            {uploadPercent != null && (
              <div className="mb-3 rounded-lg bg-[#111210] border border-[#2E2A25] p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#E8B45A]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading {mediaKind}…
                  </span>
                  <span className="text-[11px] tabular-nums text-[#A8A196]">{uploadPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#22201D] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E8B45A] transition-[width] duration-150"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#2E2A25] hover:border-[#E8B45A]/50 rounded-xl cursor-pointer bg-[#181714] transition-colors">
                <Upload className="w-5 h-5 text-[#E8B45A] mb-1.5" />
                <span className="text-xs text-[#F5EFE3] font-medium">Click to upload photo or video</span>
                <span className="text-[10px] text-[#6E675D]">
                  JPG, PNG, WebP, GIF, MP4, WebM, or MOV · videos up to 10 MB. Over that, send it to yourself on
                  WhatsApp first, then upload here.
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && mediaKind === 'image' && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#2E2A25] shrink-0">
                  <ArchiveMedia
                    src={imagePreview}
                    alt="Preview"
                    kind="image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (objectUrlRef.current) {
                        URL.revokeObjectURL(objectUrlRef.current);
                        objectUrlRef.current = null;
                      }
                      setImagePreview('');
                      setImageFile(null);
                      setMediaKind('image');
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-[#111210]/90 text-[#ffb4ab] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {imagePreview && mediaKind === 'video' && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-[#2E2A25]">
                <ArchiveMedia
                  src={imagePreview}
                  alt="Video preview"
                  kind="video"
                  mode="player"
                  className="w-full max-h-48 bg-[#111210]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (objectUrlRef.current) {
                      URL.revokeObjectURL(objectUrlRef.current);
                      objectUrlRef.current = null;
                    }
                    setImagePreview('');
                    setImageFile(null);
                    setMediaKind('image');
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-[#111210]/90 text-[#ffb4ab] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-[#ffb4ab]">{error}</p>}
          {!isCloudinaryConfigured() && (
            <p className="text-[11px] text-[#6E675D]">
              Photo and video upload requires Cloudinary unsigned preset variables. The preset must allow video. You can still preserve text-only records.
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
              {uploadPercent != null
                ? `Uploading ${uploadPercent}%`
                : busy
                  ? 'Saving…'
                  : editingItem
                    ? 'Save revisions'
                    : 'Preserve in Archive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
