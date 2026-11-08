import type { FC } from 'react';
import { ArchiveItem } from '../types';
import { Camera } from 'lucide-react';

interface AlbumsViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
  onOpenAddModal: () => void;
}

export const AlbumsView: FC<AlbumsViewProps> = ({
  items,
  onSelect,
  onOpenAddModal,
}) => {
  const memoryItems = items.filter((i) => i.category === 'memories');
  const featured = memoryItems.find((item) => item.images.length > 0) ?? memoryItems[0];

  return (
    <div className="flex flex-col w-full">
      <div className="pb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181714] text-[#E8B45A] text-[11px] tracking-widest uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B45A] animate-pulse" />
          Fellowship archive
        </div>
        <h1 className="font-editorial text-[34px] leading-[42px] text-[#F5EFE3]">
          Our <span className="italic text-[#ffd187]">Memories</span>
        </h1>
        <p className="text-[15px] leading-6 text-[#A8A196] mt-1.5">
          <span className="italic font-editorial text-[#F5EFE3]">“Ordinary moments. Extraordinary memories.”</span>
        </p>
      </div>

      {featured && (
        <button
          type="button"
          onClick={() => onSelect(featured)}
          className="relative overflow-hidden rounded-xl bg-[#22201D] text-left mb-4"
        >
          {featured.images[0] && (
            <div className="relative w-full h-64 overflow-hidden">
              <img
                alt={featured.title}
                src={featured.images[0]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#22201D] via-[#22201D]/40 to-transparent" />
            </div>
          )}
          <div className="p-5 relative">
            <p className="text-[11px] text-[#6E675D]">{featured.createdAt}</p>
            <h2 className="font-editorial text-[26px] leading-8 text-[#F5EFE3] mt-1">{featured.title}</h2>
            <p className="text-[15px] text-[#A8A196] italic mt-2 line-clamp-3">“{featured.content}”</p>
          </div>
        </button>
      )}

      <div className="flex flex-col gap-3">
        {memoryItems.filter((item) => item.id !== featured?.id).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-xl bg-[#22201D] overflow-hidden text-left"
          >
            {item.images[0] && (
              <div className="aspect-16/10 w-full overflow-hidden">
                <img src={item.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-editorial text-[20px] text-[#F5EFE3]">{item.title}</h3>
              <p className="text-[13px] text-[#A8A196] line-clamp-2 mt-1">{item.content}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="mt-6 w-full py-3 rounded-xl bg-[#E8B45A] text-[#111210] text-[14px] font-semibold flex items-center justify-center gap-2"
      >
        <Camera className="w-4 h-4" />
        Create Album
      </button>
    </div>
  );
};
