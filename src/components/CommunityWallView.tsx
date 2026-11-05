import React from 'react';
import { CommunityMember } from '../types';
import { Star, FileText, Download, UserCheck, Heart } from 'lucide-react';

interface CommunityWallViewProps {
  members: CommunityMember[];
  currentUser: CommunityMember;
  onSelectUserToImpersonate: (member: CommunityMember) => void;
  onOpenProfile: () => void;
  onExport: () => void;
}

export const CommunityWallView: React.FC<CommunityWallViewProps> = ({
  members,
  currentUser,
  onSelectUserToImpersonate,
  onOpenProfile,
  onExport,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#2E2A25]">
        <div>
          <div className="text-xs text-[#E8B45A] font-semibold tracking-wide uppercase mb-1">
            Graduates Fellowship
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5EFE3] font-medium">
            Community Wall
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
            The brotherhood and sisterhood shaped around the Hathbodhiya table. Every graduate contributes memories, receives stars of gratitude, and preserves this legacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F5EFE3] bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] rounded-md transition-colors cursor-pointer"
            title="Download full community archive as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#E8B45A]" />
            <span>Export Archive</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Edit My Profile</span>
          </button>
        </div>
      </div>

      {/* Current Active Session Notice */}
      <div className="p-4 rounded-xl bg-[#181714] border border-[#2E2A25] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8B45A]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6E675D]">Signed In As:</span>
              <span className="text-sm font-semibold text-[#F5EFE3]">{currentUser.name}</span>
            </div>
            <p className="text-xs text-[#A8A196]">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-[#E8B45A]">
            <Star className="w-4 h-4 fill-[#E8B45A]" />
            <span className="font-semibold tabular-nums">{currentUser.starsEarned}</span>
            <span className="text-[#A8A196]">stars earned</span>
          </div>
          <div className="flex items-center gap-1 text-[#F5EFE3]">
            <FileText className="w-4 h-4 text-[#A8A196]" />
            <span className="font-semibold tabular-nums">{currentUser.contributionsCount}</span>
            <span className="text-[#A8A196]">contributions</span>
          </div>
        </div>
      </div>

      {/* Wall of Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const isCurrent = member.id === currentUser.id;

          return (
            <div
              key={member.id}
              className={`p-6 rounded-2xl bg-[#22201D] border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#E8B45A]/60 shadow-lg ring-1 ring-[#E8B45A]/30'
                  : 'border-[#2E2A25] hover:border-[#423D35]'
              }`}
            >
              <div>
                {/* Member Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#2E2A25] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-editorial text-xl text-[#F5EFE3] font-medium truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#E8B45A] font-medium truncate">
                      {member.gradDegree || 'Graduate Fellowship'}
                    </p>
                    <p className="text-[11px] text-[#6E675D] mt-0.5">
                      {member.fellowshipYear}
                    </p>
                  </div>
                </div>

                {/* Personal Note of Gratitude */}
                <div className="p-3.5 rounded-lg bg-[#181714] border border-[#2E2A25] mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#A8A196] mb-1">
                    <Heart className="w-3 h-3 text-[#E8B45A]" />
                    <span>Memory of Gratitude</span>
                  </div>
                  <p className="text-xs text-[#d3c4b2] italic leading-relaxed">
                    &ldquo;{member.noteOfGratitude}&rdquo;
                  </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="pt-3 border-t border-[#2E2A25] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[#A8A196]">
                  <span className="flex items-center gap-1 text-[#E8B45A]">
                    <Star className="w-3.5 h-3.5 fill-[#E8B45A]" />
                    <strong className="tabular-nums">{member.starsEarned}</strong>
                  </span>
                  <span className="text-[#6E675D]">·</span>
                  <span>{member.contributionsCount} posts</span>
                </div>

                {!isCurrent ? (
                  <button
                    onClick={() => onSelectUserToImpersonate(member)}
                    className="text-xs text-[#A8A196] hover:text-[#E8B45A] underline decoration-[#2E2A25] hover:decoration-[#E8B45A] cursor-pointer"
                  >
                    Switch to {member.name.split(' ')[0]}
                  </button>
                ) : (
                  <span className="text-[11px] text-[#E8B45A] font-medium">
                    Active Account
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
