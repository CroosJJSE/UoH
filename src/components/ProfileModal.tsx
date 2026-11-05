import React, { useState } from 'react';
import { CommunityMember } from '../types';
import { X, UserCheck, Star, FileText, Upload } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CommunityMember;
  allMembers: CommunityMember[];
  onUpdateCurrentUser: (updated: CommunityMember) => void;
  onSelectMember: (member: CommunityMember) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allMembers,
  onUpdateCurrentUser,
  onSelectMember,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [gradDegree, setGradDegree] = useState(currentUser.gradDegree || '');
  const [fellowshipYear, setFellowshipYear] = useState(currentUser.fellowshipYear || '');
  const [noteOfGratitude, setNoteOfGratitude] = useState(currentUser.noteOfGratitude || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CommunityMember = {
      ...currentUser,
      name,
      email,
      gradDegree,
      fellowshipYear,
      noteOfGratitude,
      avatar,
    };
    onUpdateCurrentUser(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111210]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#181714] border border-[#2E2A25] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F5EFE3] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2A25] mb-6">
          <div>
            <h3 className="font-editorial text-2xl font-medium text-[#F5EFE3]">
              Google Community Profile
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

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Preview & Upload */}
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
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#181714] border border-[#2E2A25] text-xs text-[#E8B45A] hover:bg-[#2B2824] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-[#6E675D]">or paste image URL below</span>
              </div>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full px-2.5 py-1 rounded bg-[#181714] border border-[#2E2A25] text-xs text-[#A8A196] focus:border-[#E8B45A] focus:outline-none"
              />
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
              <label className="block text-xs text-[#A8A196] mb-1">Google Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-xs text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
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

          {/* Current Stats */}
          <div className="flex items-center gap-6 p-3 rounded-lg bg-[#111210] border border-[#2E2A25] text-xs text-[#A8A196]">
            <span className="flex items-center gap-1.5 text-[#E8B45A]">
              <Star className="w-4 h-4 fill-[#E8B45A]" />
              <strong>{currentUser.starsEarned}</strong> stars earned
            </span>
            <span className="flex items-center gap-1.5 text-[#F5EFE3]">
              <FileText className="w-4 h-4 text-[#A8A196]" />
              <strong>{currentUser.contributionsCount}</strong> contributions
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E2A25]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#A8A196] hover:text-[#F5EFE3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Quick Profile Switcher (For testing community interactions) */}
        <div className="mt-8 pt-6 border-t border-[#2E2A25]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8A196] mb-3">
            Quick Switch Active Member (Evaluation & Community Testing)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  onSelectMember(member);
                  onClose();
                }}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                  member.id === currentUser.id
                    ? 'bg-[#22201D] border-[#E8B45A]'
                    : 'bg-[#181714] border-[#2E2A25] hover:border-[#423D35]'
                }`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-[#F5EFE3] font-medium truncate">{member.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-[#6E675D] truncate">{member.starsEarned} stars</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
