import { ArchiveItem, CommunityMember } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import { ArchiveMedia } from './ArchiveMedia';

interface HomeViewProps {
  items: ArchiveItem[];
  currentUser: CommunityMember;
  hasMore: boolean;
  loadingMore: boolean;
  onSelectItem: (item: ArchiveItem) => void;
  onLoadMore: () => void;
}

function FeedCard({
  item,
  onSelect,
}: {
  item: ArchiveItem;
  onSelect: (item: ArchiveItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="w-full rounded-xl bg-[#22201D] overflow-hidden text-left"
    >
      {item.images[0] && (
        <div className="aspect-16/10 w-full overflow-hidden bg-[#181714]">
          <ArchiveMedia src={item.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        {item.category === 'wisdom' && (
          <p className="text-[11px] text-[#E8B45A] capitalize">
            {item.subCategory?.replace('_', ' ') || 'Guidance'}
          </p>
        )}
        <h3 className="font-editorial text-[20px] text-[#F5EFE3] mt-1">{item.title}</h3>
        {item.metadata?.goldenQuote && (
          <p className="font-editorial italic text-[18px] text-[#F5EFE3] mt-2 leading-snug line-clamp-3">
            “{item.metadata.goldenQuote}”
          </p>
        )}
        {item.content && (
          <p className="text-[13px] text-[#A8A196] line-clamp-2 mt-1">{item.content}</p>
        )}
      </div>
    </button>
  );
}

export function HomeView({
  items,
  currentUser,
  hasMore,
  loadingMore,
  onSelectItem,
  onLoadMore,
}: HomeViewProps) {
  const firstName = currentUser.name.split(' ')[0] || 'friend';
  const greetings = [
    `කෑම කන්න එන්න, ${firstName}`,
    `${firstName} did you read my article?`,
    `${firstName} What God spoke to you today?`,
  ];
  const memories = items.filter((item) => item.category === 'memories');
  const wisdom = items.filter((item) => item.category === 'wisdom');

  const videoRef = useRef<HTMLVideoElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingVisible, setGreetingVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  useEffect(() => {
    let timeout: number | undefined;
    const interval = window.setInterval(() => {
      setGreetingVisible(false);
      timeout = window.setTimeout(() => {
        setGreetingIndex((index) => (index + 1) % greetings.length);
        setGreetingVisible(true);
      }, 280);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [greetings.length]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !loadingMore) onLoadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore, items.length]);

  return (
    <div className="flex flex-col w-full gap-8">
      <section className="relative w-full overflow-hidden rounded-xl bg-[#181714] shadow-md">
          <video
            src="/door_locking.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full aspect-[16/10] object-cover object-center"
            ref={videoRef}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7">
            <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#F5EFE3] leading-snug">
              Door locks automatically.
              <br />
              <span className="text-[#E8B45A] italic">
                Hearts open automatically.
              </span>
            </p>
          </div>
      </section>

      <section className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B45A] animate-pulse" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#E8B45A]">
            The Hathbodhiya Journal
          </span>
        </div>
        <h2
          className={`font-editorial text-[20px] leading-7 text-[#F5EFE3] transition-opacity duration-300 ${
            greetingVisible ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          {greetings[greetingIndex]}
        </h2>
        <p className="text-[13px] leading-5 text-[#A8A196]">
        Dinner table will be closed at 8:00 PM.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        {memories.map((item) => (
          <FeedCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-editorial italic text-[20px] text-[#F5EFE3]">Remembered</h3>
        {wisdom.map((item) => (
          <FeedCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </section>

      <div ref={loadMoreRef} className="flex flex-col items-center gap-2 pb-2">
        {hasMore && (
          <button
            type="button"
            disabled={loadingMore}
            onClick={onLoadMore}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#E8B45A] bg-[#181714]"
          >
            {loadingMore ? 'Loading…' : 'Load earlier posts'}
          </button>
        )}
      </div>
    </div>
  );
}
