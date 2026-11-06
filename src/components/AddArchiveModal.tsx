import React, { useEffect, useState } from 'react';
import { ArchiveItem, CommunityMember, ContributionDraft } from '../types';
import { X, Upload, Plus, Trash2, Music2, UtensilsCrossed, Palette, HeartHandshake, Image as ImageIcon } from 'lucide-react';
import { isCloudinaryConfigured, uploadImage } from '../services/cloudinary';
import { toUserMessage } from '../lib/errors';

interface AddArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draft: ContributionDraft, existingId?: string) => Promise<void>;
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

  // Category specific fields
  // Recipes: ONLY ingredients and steps
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  // Museum Art / Essay / Song
  const [medium, setMedium] = useState('');
  const [scriptureVerse, setScriptureVerse] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [alexaPrompt, setAlexaPrompt] = useState('');
  const [lyricsSnippet, setLyricsSnippet] = useState('');
  const [houseMemory, setHouseMemory] = useState('');

  // Wisdom
  const [goldenQuote, setGoldenQuote] = useState('');
  const [lifePrinciple, setLifePrinciple] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const item = editingItem;
    setCategory(item?.category ?? 'recipes');
    setSubCategory(item?.subCategory ?? (item?.category === 'museum' ? 'art' : 'mains'));
    setTitle(item?.title ?? '');
    setContent(item?.content ?? '');
    setImagePreview(item?.images?.[0] ?? '');
    setImageFile(null);
    setIngredients(item?.metadata?.ingredients?.length ? item.metadata.ingredients : ['']);
    setSteps(item?.metadata?.steps?.length ? item.metadata.steps : ['']);
    setMedium(item?.metadata?.medium ?? '');
    setScriptureVerse(item?.metadata?.scriptureVerse ?? item?.metadata?.scripturePassage ?? '');
    setReadingTime(item?.metadata?.readingTime ?? '');
    setSongArtist(item?.metadata?.artist ?? '');
    setAlexaPrompt(item?.metadata?.alexaPrompt ?? '');
    setLyricsSnippet(item?.metadata?.lyricsSnippet ?? '');
    setHouseMemory(item?.metadata?.houseMemory ?? '');
    setGoldenQuote(item?.metadata?.goldenQuote ?? '');
    setLifePrinciple(item?.metadata?.lifePrinciple ?? '');
    setError(null);
  }, [isOpen, editingItem]);

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

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const handleUpdateIngredient = (index: number, val: string) => {
    const updated = [...ingredients];
    updated[index] = val;
    setIngredients(updated);
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  const handleUpdateStep = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (category !== 'recipes' && !content.trim()) return;

    setBusy(true);
    setError(null);

    const metadata: ArchiveItem['metadata'] = {};

    if (category === 'recipes') {
      metadata.ingredients = ingredients.filter((i) => i.trim().length > 0);
      metadata.steps = steps.filter((s) => s.trim().length > 0);
    } else if (category === 'museum') {
      if (subCategory === 'art') {
        metadata.medium = medium || undefined;
        metadata.scriptureVerse = scriptureVerse || undefined;
      } else if (subCategory === 'articles') {
        metadata.readingTime = readingTime || undefined;
        metadata.scripturePassage = scriptureVerse || undefined;
      } else if (subCategory === 'songs') {
        metadata.songTitle = title;
        metadata.artist = songArtist || undefined;
        metadata.alexaPrompt = alexaPrompt || undefined;
        metadata.lyricsSnippet = lyricsSnippet || undefined;
        metadata.houseMemory = houseMemory || undefined;
      }
    } else if (category === 'wisdom') {
      metadata.goldenQuote = goldenQuote || undefined;
      metadata.lifePrinciple = lifePrinciple || undefined;
    }

    try {
      let images = imagePreview && imagePreview.startsWith('https://') ? [imagePreview] : [];
      if (imageFile) {
        images = [await uploadImage(imageFile)];
      }

      await onSave(
        {
          category,
          subCategory,
          title,
          content: category === 'recipes' ? '' : content,
          images,
          metadata,
        },
        editingItem?.id
      );

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

          {/* Non-Recipe Content / Description */}
          {category !== 'recipes' && (
            <div>
              <label className="block text-xs text-[#A8A196] mb-1">
                {subCategory === 'songs'
                  ? 'Why this song matters at Hathbodhiya *'
                  : 'Reflection & Description *'}
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the reflection or memory..."
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {/* RECIPE ONLY: Ingredients Builder & Steps Builder */}
          {category === 'recipes' && (
            <div className="space-y-5 p-4 rounded-xl bg-[#111210] border border-[#2E2A25]">
              {/* Ingredients Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#E8B45A] font-semibold uppercase tracking-wider">
                    Ingredients List
                  </span>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="flex items-center gap-1 text-xs text-[#E8B45A] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Ingredient
                  </button>
                </div>
                <div className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => handleUpdateIngredient(idx, e.target.value)}
                        placeholder={`Ingredient ${idx + 1} (e.g. 4 large potatoes, quartered)`}
                        className="flex-1 px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                      />
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="p-1.5 text-[#6E675D] hover:text-[#ffb4ab] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#E8B45A] font-semibold uppercase tracking-wider">
                    Step-by-Step Instructions
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="flex items-center gap-1 text-xs text-[#E8B45A] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {steps.map((st, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-[#6E675D] w-5 text-right tabular-nums">{idx + 1}.</span>
                      <input
                        type="text"
                        value={st}
                        onChange={(e) => handleUpdateStep(idx, e.target.value)}
                        placeholder={`Step ${idx + 1} instruction...`}
                        className="flex-1 px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                      />
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="p-1.5 text-[#6E675D] hover:text-[#ffb4ab] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Song in Alexa fields */}
          {category === 'museum' && subCategory === 'songs' && (
            <div className="space-y-4 p-4 rounded-xl bg-[#111210] border border-[#2E2A25]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E8B45A]">
                <Music2 className="w-4 h-4" />
                <span>Song Details</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-[#A8A196] mb-1">Artist / Composer</label>
                  <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="e.g. Audrey Assad / Sovereign Grace"
                    className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A8A196] mb-1">Alexa Command Prompt</label>
                  <input
                    type="text"
                    value={alexaPrompt}
                    onChange={(e) => setAlexaPrompt(e.target.value)}
                    placeholder="e.g. Alexa, play Be Thou My Vision"
                    className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A8A196] mb-1">Lyrics Snippet</label>
                  <textarea
                    rows={2}
                    value={lyricsSnippet}
                    onChange={(e) => setLyricsSnippet(e.target.value)}
                    placeholder="e.g. Riches I heed not, nor man's empty praise..."
                    className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A8A196] mb-1">House Memory</label>
                  <input
                    type="text"
                    value={houseMemory}
                    onChange={(e) => setHouseMemory(e.target.value)}
                    placeholder="e.g. Played on Sunday evenings during cleanup"
                    className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Museum Art fields */}
          {category === 'museum' && subCategory === 'art' && (
            <div className="space-y-3 p-4 rounded-xl bg-[#111210] border border-[#2E2A25]">
              <div>
                <label className="block text-[11px] text-[#A8A196] mb-1">Art Medium & Tools</label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. Charcoal on textured paper"
                  className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A8A196] mb-1">Scripture Verse</label>
                <input
                  type="text"
                  value={scriptureVerse}
                  onChange={(e) => setScriptureVerse(e.target.value)}
                  placeholder="e.g. Psalm 90:1"
                  className="w-full px-3 py-1.5 rounded-md bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
                />
              </div>
            </div>
          )}

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
