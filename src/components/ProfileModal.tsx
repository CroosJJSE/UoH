import React, { useEffect, useState } from 'react';
import { CommunityMember } from '../types';
import { X, FileText, Upload } from 'lucide-react';
import { signOut } from '../services/auth';
import { isCloudinaryConfigured, uploadImage } from '../services/cloudinary';
import { toUserMessage } from '../lib/errors';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CommunityMember;
  onUpdateCurrentUser: (updated: CommunityMember) => Promise<void> | void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [gradDegree, setGradDegree] = useState(currentUser.gradDegree || '');
  const [fellowshipYear, setFellowshipYear] = useState(currentUser.fellowshipYear || '');
  const [noteOfGratitude, setNoteOfGratitude] = useState(currentUser.noteOfGratitude || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(currentUser.name);
    setGradDegree(currentUser.gradDegree || '');
    setFellowshipYear(currentUser.fellowshipYear || '');
    setNoteOfGratitude(currentUser.noteOfGratitude || '');
    setAvatar(currentUser.avatar);
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setAvatar(url);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onUpdateCurrentUser({
        ...currentUser,
        name: name.trim(),
        gradDegree,
        fellowshipYear,
        noteOfGratitude,
        avatar,
      });
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
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2A25] mb-6">
          <div>
            <h3 className="font-editorial text-2xl font-medium text-[#F5EFE3]">
              Community Profile
            </h3>
            <p className="text-xs text-[#A8A196] mt-0.5">
              Your identity on the University of Hathbodhiya community wall
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8A196] hover:text-[#F5EFE3] hover:bg-[#22201D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#22201D] border border-[#2E2A25]">
            <img
              src={avatar}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#E8B45A] shrink-0"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#F5EFE3] mb-1">
                Profile Avatar
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#181714] border border-[#2E2A25] text-xs text-[#E8B45A] hover:bg-[#2B2824] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isCloudinaryConfigured() ? 'Upload Image' : 'Configure Cloudinary to upload'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={busy || !isCloudinaryConfigured()}
                />
              </label>
              <p className="mt-2 text-[11px] text-[#6E675D]">
                Google photo is used when you sign in with Google. Email is never shown on other profiles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A8A196] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A8A196] mb-1">Signed-in email</label>
              <input
                type="email"
                readOnly
                value={currentUser.email ?? ''}
                className="w-full px-3 py-2 rounded-lg bg-[#181714] border border-[#2E2A25] text-xs text-[#6E675D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A8A196] mb-1">Degree & Field</label>
              <input
                type="text"
                value={gradDegree}
                onChange={(e) => setGradDegree(e.target.value)}
                placeholder="e.g. M.Sc Computer Science, 2024"
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A8A196] mb-1">Fellowship Cohort</label>
              <input
                type="text"
                value={fellowshipYear}
                onChange={(e) => setFellowshipYear(e.target.value)}
                placeholder="e.g. Fellowship Class of 2022-Present"
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A8A196] mb-1">
              Personal Note of Gratitude (Displayed on Wall)
            </label>
            <textarea
              rows={3}
              value={noteOfGratitude}
              onChange={(e) => setNoteOfGratitude(e.target.value)}
              placeholder="What does Hathbodhiya mean to your Christian walk and life?"
              className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-6 p-3 rounded-lg bg-[#111210] border border-[#2E2A25] text-xs text-[#A8A196]">
            <span className="flex items-center gap-1.5 text-[#E8B45A]">
              <FileText className="w-4 h-4 text-[#E8B45A]" />
              <strong>{currentUser.contributionsCount}</strong> posts documented
            </span>
            <span className="text-[#6E675D]">{currentUser.role.replace('_', ' ')}</span>
          </div>

          {error && <p className="text-xs text-[#ffb4ab]">{error}</p>}

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#2E2A25]">
            <button
              type="button"
              onClick={() => void signOut()}
              className="px-4 py-2 text-xs text-[#ffb4ab] hover:text-[#ffd2cc] cursor-pointer"
            >
              Sign out
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#A8A196] hover:text-[#F5EFE3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2 rounded-lg text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] transition-colors cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Saving…' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
