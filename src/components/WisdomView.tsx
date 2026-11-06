import type { FC } from 'react';
import { ArchiveItem } from '../types';
import { Plus } from 'lucide-react';

interface WisdomViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onStar: (itemId: string) => void;
  currentUserId: string;
  onOpenAddModal: () => void;
}

export const WisdomView: FC<WisdomViewProps> = ({
  items,
  onSelect,
  onOpenAddModal,
}) => {
  const wisdomItems = items.filter((i) => i.category === 'wisdom');

  return (
    <div className="flex flex-col w-full">
      <header className="pb-4">
        <span className="text-[11px] text-[#E8B45A] uppercase tracking-widest font-semibold">
          Things we don't want to forget
        </span>
        <h1 className="font-editorial italic text-[34px] leading-[42px] text-[#F5EFE3] mt-1">
          Remembered
        </h1>
        <p className="text-[15px] text-[#A8A196] mt-1.5">
          Golden counsels spoken quietly over cups of tea.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {wisdomItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="p-5 rounded-xl bg-[#22201D] text-left overflow-hidden"
          >
            <p className="text-[11px] text-[#E8B45A] capitalize">
              {item.subCategory?.replace('_', ' ') || 'Guidance'}
            </p>
            <h3 className="font-editorial text-[20px] text-[#F5EFE3] mt-2">{item.title}</h3>
            {item.metadata?.goldenQuote && (
              <p className="font-editorial italic text-[18px] text-[#F5EFE3] mt-3 leading-snug">
                “{item.metadata.goldenQuote}”
              </p>
            )}
            <p className="text-[13px] text-[#A8A196] line-clamp-3 mt-2">{item.content}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="mt-6 w-full py-3 rounded-xl bg-[#E8B45A] text-[#111210] text-[14px] font-semibold flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Record a lesson
      </button>
    </div>
  );
};
