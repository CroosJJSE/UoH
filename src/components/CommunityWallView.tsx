import { useState, type FC } from 'react';
import { ArchiveItem, CommunityMember } from '../types';
import { AdminPanel } from './AdminPanel';
import { isSteward } from '../services/users';

interface CommunityWallViewProps {
  members: CommunityMember[];
  currentUser: CommunityMember;
  items: ArchiveItem[];
  onOpenProfile: () => void;
  onExport: () => void;
  onSelectItem: (item: ArchiveItem) => void;
}

export const CommunityWallView: FC<CommunityWallViewProps> = ({
  members,
  currentUser,
  items,
  onOpenProfile,
  onExport,
  onSelectItem,
}) => {
  const [historyMember, setHistoryMember] = useState<CommunityMember | null>(null);
  const historyItems = historyMember ? items.filter((item) => item.authorId === historyMember.id) : [];

  return (
    <div className="flex flex-col w-full gap-5">
      <header>
        <span className="text-[11px] text-[#E8B45A] uppercase tracking-widest font-semibold">
          Graduates fellowship
        </span>
        <h2 className="font-editorial text-[34px] leading-[42px] text-[#F5EFE3] mt-1">Community</h2>
        <p className="text-[13px] text-[#A8A196] mt-1">
          The brotherhood and sisterhood shaped around the Hathbodhiya table.
        </p>
      </header>

      <button
        type="button"
        onClick={onOpenProfile}
        className="p-4 rounded-xl bg-[#22201D] flex items-center gap-3 text-left overflow-hidden"
      >
        <img
          src={currentUser.avatar}
          alt=""
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#F5EFE3] truncate">{currentUser.name}</p>
          <p className="text-[12px] text-[#A8A196] truncate">Edit my profile</p>
        </div>
      </button>

      {isSteward(currentUser) && <AdminPanel currentUser={currentUser} />}

      {historyMember && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-editorial text-[20px] text-[#F5EFE3] truncate">
              {historyMember.name}
            </h3>
            <button type="button" onClick={() => setHistoryMember(null)} className="text-[12px] text-[#E8B45A] shrink-0">
              Back
            </button>
          </div>
          {historyItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className="w-full text-left p-4 rounded-xl bg-[#22201D]"
            >
              <p className="text-[11px] text-[#E8B45A] capitalize">{item.category}</p>
              <h4 className="font-editorial text-[18px] text-[#F5EFE3]">{item.title}</h4>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => setHistoryMember(member)}
            className="p-5 rounded-xl bg-[#22201D] text-left overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <img
                src={member.avatar}
                alt=""
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-editorial text-[20px] text-[#F5EFE3] truncate">{member.name}</h3>
                <p className="text-[12px] text-[#E8B45A] truncate">{member.gradDegree || 'Graduate Fellowship'}</p>
              </div>
            </div>
            <p className="text-[13px] text-[#d3c4b2] italic mt-3 line-clamp-3">
              “{member.noteOfGratitude || 'A quiet place at the table.'}”
            </p>
            <p className="text-[11px] text-[#6E675D] mt-3">
              {member.starsEarned} stars · {member.contributionsCount} posts
            </p>
          </button>
        ))}
      </div>

      <button type="button" onClick={onExport} className="text-[12px] text-[#A8A196] py-2">
        Export archive
      </button>
    </div>
  );
};
