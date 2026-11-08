import { useState, type FC } from 'react';
import { ArchiveItem } from '../types';

interface MuseumViewProps {
  items: ArchiveItem[];
  onSelect: (item: ArchiveItem) => void;
}

export const MuseumView: FC<MuseumViewProps> = ({
  items,
  onSelect,
}) => {
  const [subFilter, setSubFilter] = useState<'all' | 'art' | 'articles' | 'songs'>('all');
  const museumItems = items.filter((item) => item.category === 'museum');
  const filteredItems = museumItems.filter((item) => subFilter === 'all' || item.subCategory === subFilter);
  const featured = filteredItems.find((item) => item.images.length > 0) ?? filteredItems[0];

  return (
    <div className="flex flex-col w-full">
      <section className="flex flex-col pb-4">
        <span className="text-[11px] text-[#E8B45A] uppercase tracking-widest font-semibold mb-1">
          The Archives & Exhibition
        </span>
        <h1 className="font-editorial italic text-[34px] leading-[42px] text-[#F5EFE3] tracking-tight">
          The Museum
        </h1>
        <p className="text-[15px] leading-6 text-[#A8A196] mt-1.5">
          A collection of beautiful things made and shared among us.
        </p>
      </section>

      {featured && (
        <button
          type="button"
          onClick={() => onSelect(featured)}
          className="bg-[#22201D] rounded-xl p-3 shadow-xl flex flex-col text-left mb-4 overflow-hidden"
        >
          {featured.images[0] && (
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#0d0e0d]">
              <img
                alt={featured.title}
                src={featured.images[0]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="pt-4 px-1 pb-1">
            <span className="text-[11px] text-[#6E675D] uppercase tracking-wider">
              {featured.subCategory?.replace('_', ' ') || 'Archive'}
            </span>
            <h2 className="font-editorial italic text-[26px] leading-8 text-[#F5EFE3] mt-0.5">{featured.title}</h2>
            <p className="text-[13px] text-[#A8A196] italic mt-2 bg-[#181714]/60 p-3 rounded-lg line-clamp-3">
              {featured.content}
            </p>
            <div className="flex items-center gap-2.5 pt-4">
              <img src={featured.author.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#F5EFE3] truncate">{featured.author.name}</p>
                <p className="text-[11px] text-[#6E675D]">{featured.createdAt}</p>
              </div>
            </div>
          </div>
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          ['all', 'All', museumItems.length],
          ['art', 'Art & Drawings', museumItems.filter((i) => i.subCategory === 'art').length],
          ['articles', 'Articles', museumItems.filter((i) => i.subCategory === 'articles').length],
          ['songs', 'Songs & Music', museumItems.filter((i) => i.subCategory === 'songs').length],
        ] as const).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubFilter(id)}
            className={`px-4 py-2 rounded-full text-[11px] font-medium ${
              subFilter === id ? 'bg-[#E8B45A] text-[#111210] font-semibold' : 'bg-[#181714] text-[#A8A196]'
            }`}
          >
            {label} <span className="opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-xl bg-[#22201D] overflow-hidden text-left"
          >
            {item.images[0] && (
              <div className="aspect-4/3 w-full overflow-hidden bg-[#181714]">
                <img src={item.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <p className="text-[11px] text-[#E8B45A] capitalize">{item.subCategory?.replace('_', ' ')}</p>
              <h3 className="font-editorial text-[20px] text-[#F5EFE3] mt-1">{item.title}</h3>
              <p className="text-[13px] text-[#A8A196] line-clamp-2 mt-1">{item.content}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
