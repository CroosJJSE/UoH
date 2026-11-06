import { useMemo, useState, type FC } from 'react';
import { ArchiveItem, CommunityMember } from '../types';
import { AdminPanel } from './AdminPanel';
import { isSteward } from '../services/users';
import { ArrowLeft, BookOpen, Download, Plus, Sparkles, User, X } from 'lucide-react';

interface CommunityWallViewProps {
  members: CommunityMember[];
  currentUser: CommunityMember;
  items: ArchiveItem[];
  onOpenProfile: () => void;
  onExport: () => void;
  onSelectItem: (item: ArchiveItem) => void;
  onOpenAddModal: () => void;
}

type SkyFilter = 'all' | 'active' | 'new';

interface ConstellationSlot {
  top: string;
  left?: string;
  right?: string;
  size: number;
  badge?: 'sparkle' | 'book';
  isTopRank?: boolean;
  category: 'active' | 'new';
  roleDefault: string;
}

const CONSTELLATION_SLOTS: ConstellationSlot[] = [
  {
    top: '20%',
    left: '50%',
    size: 96,
    badge: 'sparkle',
    isTopRank: true,
    category: 'active',
    roleDefault: 'Hearth Pillar',
  },
  {
    top: '16%',
    left: '18%',
    size: 78,
    badge: 'book',
    category: 'active',
    roleDefault: 'Chronicler',
  },
  {
    top: '18%',
    left: '82%',
    size: 76,
    badge: 'book',
    category: 'active',
    roleDefault: 'Keeper of Bread',
  },
  {
    top: '46%',
    left: '26%',
    size: 68,
    category: 'active',
    roleDefault: 'Song Weaver',
  },
  {
    top: '48%',
    left: '76%',
    size: 66,
    category: 'active',
    roleDefault: 'Archivist',
  },
  {
    top: '64%',
    left: '46%',
    size: 58,
    category: 'active',
    roleDefault: 'Woodcraft Caretaker',
  },
  {
    top: '64%',
    left: '12%',
    size: 52,
    category: 'active',
    roleDefault: 'Story Gatherer',
  },
  {
    top: '66%',
    left: '88%',
    size: 50,
    category: 'new',
    roleDefault: 'Fellow Traveler',
  },
  {
    top: '84%',
    left: '24%',
    size: 46,
    category: 'new',
    roleDefault: 'Welcome Guest',
  },
  {
    top: '84%',
    left: '74%',
    size: 44,
    category: 'new',
    roleDefault: 'Fresh Seeker',
  },
];

function getInitials(name: string): string {
  if (!name) return 'H';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getMemberRole(member: CommunityMember, fallback: string): string {
  if (member.gradDegree && member.gradDegree.trim().length > 0) {
    return member.gradDegree;
  }
  return fallback;
}

export const CommunityWallView: FC<CommunityWallViewProps> = ({
  members,
  currentUser,
  items,
  onOpenProfile,
  onExport,
  onSelectItem,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState<SkyFilter>('all');
  const [historyMember, setHistoryMember] = useState<CommunityMember | null>(null);

  // Sort members by post count descending
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => (b.contributionsCount || 0) - (a.contributionsCount || 0));
  }, [members]);

  // Default inspector to top contributor
  const [inspectedMember, setInspectedMember] = useState<CommunityMember | null>(() => {
    return sortedMembers.length > 0 ? sortedMembers[0] : null;
  });

  const inspectedItems = useMemo(() => {
    if (!inspectedMember) return [];
    return items.filter((item) => item.authorId === inspectedMember.id);
  }, [inspectedMember, items]);

  const historyItems = useMemo(() => {
    if (!historyMember) return [];
    return items.filter((item) => item.authorId === historyMember.id);
  }, [historyMember, items]);

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Celestial Atmosphere Canvas Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111210] border border-[#2E2A25] p-5">
        {/* Ambient Starlight Backdrop Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18%" cy="12%" fill="#E8B45A" opacity="0.6" r="1.2" />
            <circle cx="82%" cy="18%" fill="#F5EFE3" opacity="0.4" r="1.5" />
            <circle cx="64%" cy="38%" fill="#E8B45A" opacity="0.5" r="0.9" />
            <circle cx="28%" cy="56%" fill="#F5EFE3" opacity="0.7" r="1.2" />
            <circle cx="88%" cy="72%" fill="#E8B45A" opacity="0.3" r="1" />
            <circle cx="12%" cy="84%" fill="#F5EFE3" opacity="0.5" r="1.4" />
            <circle cx="45%" cy="92%" fill="#E8B45A" opacity="0.8" r="0.8" />
          </svg>
        </div>

        <header className="relative z-10">
          <span className="text-[11px] text-[#E8B45A] uppercase tracking-widest font-semibold">
            Fellowship Constellation
          </span>
          <h2 className="font-editorial text-[34px] leading-[42px] text-[#F5EFE3] mt-1">Community</h2>
          <p className="text-[13px] text-[#A8A196] mt-1">
            Every soul anchored around the Hathbodhiya table, joined in memory and gratitude.
          </p>
        </header>

        {/* User Profile Quick Access */}
        <div className="mt-4 pt-4 border-t border-[#2E2A25] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-3 text-left group min-w-0"
          >
            <img
              src={currentUser.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#E8B45A]/50 group-hover:ring-[#E8B45A] transition-all"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-[#F5EFE3] truncate">{currentUser.name}</p>
                <span className="text-[10px] bg-[#E8B45A]/15 text-[#E8B45A] px-2 py-0.5 rounded-full font-medium shrink-0">
                  You
                </span>
              </div>
              <p className="text-[11px] text-[#A8A196] truncate">Edit my profile & fellowship note</p>
            </div>
          </button>
          <span className="text-[11px] text-[#E8B45A] font-semibold shrink-0">
            {currentUser.contributionsCount} {currentUser.contributionsCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>

      {/* Steward Admin Panel (if applicable) */}
      {isSteward(currentUser) && <AdminPanel currentUser={currentUser} />}

      {/* Sky View Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-200 ${
            filter === 'all'
              ? 'bg-[#22201D] text-[#E8B45A] border border-[#E8B45A]/30 shadow-sm'
              : 'bg-[#181714] text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          {filter === 'all' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B45A] animate-pulse" />
          )}
          <span>Whole Sky ({members.length} Souls)</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
            filter === 'active'
              ? 'bg-[#22201D] text-[#E8B45A] border border-[#E8B45A]/30 shadow-sm'
              : 'bg-[#181714] text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          <span>This Month</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('new')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
            filter === 'new'
              ? 'bg-[#22201D] text-[#E8B45A] border border-[#E8B45A]/30 shadow-sm'
              : 'bg-[#181714] text-[#A8A196] hover:text-[#F5EFE3]'
          }`}
        >
          <span>New Faces</span>
        </button>
      </div>

      {/* Interactive Dynamic Constellation Map */}
      <div className="relative w-full h-[470px] bg-[#181714] rounded-2xl overflow-hidden p-2 shadow-inner border border-[#2E2A25]">
        {/* Filament Starlight Connections SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line stroke="#E8B45A" strokeDasharray="3 3" strokeWidth="0.75" x1="50%" y1="20%" x2="18%" y2="16%" />
          <line stroke="#E8B45A" strokeDasharray="3 3" strokeWidth="0.75" x1="50%" y1="20%" x2="82%" y2="18%" />
          <line stroke="#E8B45A" strokeWidth="0.75" x1="50%" y1="20%" x2="26%" y2="46%" />
          <line stroke="#E8B45A" strokeWidth="0.75" x1="50%" y1="20%" x2="76%" y2="48%" />
          <line stroke="#E8B45A" strokeDasharray="2 4" strokeWidth="0.75" x1="26%" y1="46%" x2="12%" y2="64%" />
          <line stroke="#E8B45A" strokeWidth="0.75" x1="26%" y1="46%" x2="46%" y2="64%" />
          <line stroke="#E8B45A" strokeDasharray="2 4" strokeWidth="0.75" x1="76%" y1="48%" x2="88%" y2="66%" />
          <line stroke="#E8B45A" strokeDasharray="3 3" strokeWidth="0.75" x1="46%" y1="64%" x2="74%" y2="84%" />
          <line stroke="#E8B45A" strokeDasharray="3 3" strokeWidth="0.75" x1="12%" y1="64%" x2="24%" y2="84%" />
        </svg>

        {/* Soft Center Ambient Hearth Glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#E8B45A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Constellation Nodes */}
        {CONSTELLATION_SLOTS.map((slot, index) => {
          const member = sortedMembers[index];
          if (!member) return null;

          const isSelected = inspectedMember?.id === member.id;
          const isFilterMatch =
            filter === 'all' ||
            (filter === 'active' && slot.category === 'active') ||
            (filter === 'new' && slot.category === 'new');

          return (
            <div
              key={member.id}
              onClick={() => setInspectedMember(member)}
              style={{
                top: slot.top,
                left: slot.left,
                right: slot.right,
                transform: `translate(-50%, -50%) scale(${
                  isSelected ? 1.12 : isFilterMatch ? 1 : 0.88
                })`,
                opacity: isFilterMatch ? 1 : 0.25,
                pointerEvents: isFilterMatch ? 'auto' : 'none',
              }}
              className="absolute flex flex-col items-center cursor-pointer group z-20 transition-all duration-300"
            >
              {/* Outer Glow & Ring Container */}
              <div
                style={{ width: `${slot.size}px`, height: `${slot.size}px` }}
                className={`relative rounded-full transition-transform duration-300 group-hover:scale-105 ${
                  slot.isTopRank
                    ? 'p-[3px] bg-gradient-to-tr from-[#E8B45A] via-[#ffd187] to-[#E8B45A]/40 shadow-[0_0_24px_rgba(232,180,90,0.35)]'
                    : slot.badge === 'book'
                    ? 'p-[2.5px] bg-gradient-to-b from-[#E8B45A] to-transparent shadow-[0_0_18px_rgba(232,180,90,0.25)]'
                    : slot.category === 'new'
                    ? 'p-[1.5px] bg-[#E8B45A]/35 shadow-sm'
                    : 'p-[2px] bg-[#2B2824] shadow-md group-hover:bg-[#E8B45A]/60'
                } ${isSelected ? 'ring-2 ring-[#E8B45A] ring-offset-2 ring-offset-[#181714]' : ''}`}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full bg-[#22201D]"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#22201D] flex items-center justify-center text-[#F5EFE3] font-editorial text-[14px]">
                    {getInitials(member.name)}
                  </div>
                )}

                {/* Badge Icon */}
                {slot.badge === 'sparkle' && (
                  <span className="absolute -bottom-1 -right-1 bg-[#22201D] text-[#E8B45A] rounded-full p-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-[#E8B45A]" />
                  </span>
                )}
                {slot.badge === 'book' && (
                  <span className="absolute -bottom-1 -right-0.5 bg-[#22201D] text-[#E8B45A] rounded-full p-1 shadow-md">
                    <BookOpen className="w-3 h-3 text-[#E8B45A]" />
                  </span>
                )}
              </div>

              {/* Member Short Name & Score */}
              <span
                className={`text-[12px] text-[#F5EFE3] mt-1 font-medium tracking-tight truncate max-w-[80px] text-center ${
                  slot.isTopRank ? 'font-editorial text-[14px]' : ''
                }`}
              >
                {member.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#E8B45A] font-semibold">
                {member.contributionsCount} {member.contributionsCount === 1 ? 'post' : 'posts'}
              </span>
            </div>
          );
        })}

        {/* Warm Floating Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22201D]/80 backdrop-blur-md shadow-sm pointer-events-none border border-[#2E2A25]/40">
          <Sparkles className="w-3 h-3 text-[#E8B45A]" />
          <span className="text-[10px] text-[#A8A196]">Tap any soul to witness their offerings</span>
        </div>
      </div>

      {/* Dynamic Inspector Preview Card */}
      {inspectedMember && (
        <div className="bg-[#22201D] border border-[#2E2A25] rounded-xl p-4 transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-[#E8B45A]/40 bg-[#181714]">
                {inspectedMember.avatar ? (
                  <img
                    src={inspectedMember.avatar}
                    alt={inspectedMember.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#F5EFE3] font-editorial text-[15px]">
                    {getInitials(inspectedMember.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="font-editorial text-[19px] text-[#F5EFE3] leading-snug truncate">
                  {inspectedMember.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  <span className="text-[#E8B45A] font-semibold">
                    {inspectedMember.contributionsCount} {inspectedMember.contributionsCount === 1 ? 'post' : 'posts'}
                  </span>
                  <span className="text-[#6E675D]">•</span>
                  <span className="text-[#A8A196] truncate">
                    {getMemberRole(inspectedMember, 'Faithful Steward')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectedMember(null)}
              className="p-1 rounded-lg text-[#A8A196] hover:text-[#F5EFE3] hover:bg-[#2B2824] transition-colors"
              aria-label="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[13px] text-[#d3c4b2] italic mt-3 line-clamp-3">
            “{inspectedMember.noteOfGratitude || 'A quiet place at the table.'}”
          </p>

          <div className="mt-3 pt-3 border-t border-[#2E2A25] flex items-center justify-between gap-3">
            <p className="text-[11px] text-[#6E675D]">
              {inspectedMember.contributionsCount} offerings archived
            </p>
            <button
              type="button"
              onClick={() => setHistoryMember(inspectedMember)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8B45A]/15 text-[#E8B45A] hover:bg-[#E8B45A]/25 text-[12px] font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Witness Offerings ({inspectedItems.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Prominent Contribution Action: Offer to the Table */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#22201D] to-[#181714] border border-[#2E2A25] shadow-sm">
        <div className="min-w-0 pr-3">
          <h4 className="font-editorial text-[18px] text-[#F5EFE3] leading-snug">Offer to the Table</h4>
          <p className="text-[12px] text-[#A8A196] mt-0.5">
            Share an artwork, recipe, song, photo, or memory.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-[#E8B45A] hover:bg-[#D4A045] text-[#111210] font-semibold text-[13px] flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Offerings History Drawer / Modal */}
      {historyMember && (
        <div className="space-y-3 bg-[#181714] border border-[#2E2A25] rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#2E2A25] pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setHistoryMember(null)}
                className="p-1.5 rounded-lg bg-[#22201D] text-[#A8A196] hover:text-[#F5EFE3]"
                aria-label="Back to wall"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h3 className="font-editorial text-[20px] text-[#F5EFE3] truncate">
                  {historyMember.name}’s Offerings
                </h3>
                <p className="text-[11px] text-[#A8A196]">
                  {historyItems.length} records preserved in the archive
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHistoryMember(null)}
              className="text-[12px] text-[#E8B45A] font-medium"
            >
              Close
            </button>
          </div>

          {historyItems.length === 0 ? (
            <p className="text-[13px] text-[#A8A196] py-4 text-center italic">
              No offerings documented under this member yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {historyItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left p-3.5 rounded-xl bg-[#22201D] hover:bg-[#2B2824] transition-colors border border-[#2E2A25]/60"
                >
                  <span className="text-[11px] text-[#E8B45A] capitalize font-medium">
                    {item.category}
                  </span>
                  <h4 className="font-editorial text-[17px] text-[#F5EFE3] mt-0.5">{item.title}</h4>
                  <p className="text-[12px] text-[#A8A196] mt-1 line-clamp-2">{item.content}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fellowship Directory: All Souls at the Table */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-[22px] text-[#F5EFE3]">All Souls at the Table</h3>
          <span className="text-[12px] text-[#A8A196]">{members.length} members</span>
        </div>

        {sortedMembers.map((member, index) => (
          <div
            key={member.id}
            className="p-4 rounded-xl bg-[#22201D] border border-[#2E2A25] flex flex-col gap-3 hover:border-[#423D35] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setInspectedMember(member);
                  setHistoryMember(member);
                }}
                className="flex items-center gap-3 text-left min-w-0 flex-1"
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-[#E8B45A]/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#181714] flex items-center justify-center text-[#F5EFE3] font-editorial text-[14px] shrink-0 border border-[#2E2A25]">
                    {getInitials(member.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-editorial text-[18px] text-[#F5EFE3] truncate">
                      {member.name}
                    </h4>
                    {index === 0 && (
                      <span className="text-[10px] bg-[#E8B45A]/20 text-[#E8B45A] px-2 py-0.5 rounded-full font-medium">
                        Hearth Pillar
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#E8B45A] truncate">
                    {getMemberRole(member, 'Graduate Fellowship')}
                  </p>
                </div>
              </button>

              <div className="text-right shrink-0">
                <span className="text-[12px] text-[#E8B45A] font-semibold block">
                  {member.contributionsCount} {member.contributionsCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#d3c4b2] italic line-clamp-3">
              “{member.noteOfGratitude || 'A quiet place at the table.'}”
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#2E2A25]/60 text-[11px]">
              <span className="text-[#6E675D]">{member.fellowshipYear || 'Fellowship Family'}</span>
              <button
                type="button"
                onClick={() => setHistoryMember(member)}
                className="text-[#E8B45A] hover:underline font-medium"
              >
                View offerings →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Archive Action */}
      <div className="pt-2 pb-6 flex justify-center">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 text-[12px] text-[#A8A196] hover:text-[#F5EFE3] py-2 px-4 rounded-lg hover:bg-[#22201D] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export entire archive (JSON)</span>
        </button>
      </div>
    </div>
  );
};
