import React from 'react';
import { CategoryType } from '../types';
import { Palette, UtensilsCrossed, Image as ImageIcon, HeartHandshake, Award } from 'lucide-react';

interface CategoryNavGridProps {
  onSelectCategory: (cat: CategoryType) => void;
  counts: {
    museum: number;
    recipes: number;
    memories: number;
    wisdom: number;
    wall: number;
  };
}

export const CategoryNavGrid: React.FC<CategoryNavGridProps> = ({
  onSelectCategory,
  counts,
}) => {
  const categories = [
    {
      id: 'museum' as CategoryType,
      title: 'Museum',
      subtitle: 'Art, Drawings, Writings & House Songs',
      description: 'Carefully preserved sketches, theological essays on Christian grace, and the list of hymns and Alexa songs played in the living room.',
      icon: Palette,
      count: counts.museum,
      countLabel: 'works preserved',
    },
    {
      id: 'recipes' as CategoryType,
      title: 'Recipe Book',
      subtitle: 'Comforting Fellowship Dishes',
      description: 'Every Sabbath claypot stew, herbal chicken, and midnight milk tea cooked for hungry students, with ingredients and instructions.',
      icon: UtensilsCrossed,
      count: counts.recipes,
      countLabel: 'recipes documented',
    },
    {
      id: 'memories' as CategoryType,
      title: 'Memory Albums',
      subtitle: 'Gatherings, Selfies & Quiet Hours',
      description: 'Visual chronicles of laughter around the long dining table, rainy afternoons on the verandah, and quiet prayer times by the hearth.',
      icon: ImageIcon,
      count: counts.memories,
      countLabel: 'moments saved',
    },
    {
      id: 'wisdom' as CategoryType,
      title: "Things We Don't Want to Forget",
      subtitle: 'Golden Advice & Perspectives',
      description: 'Foundational lessons on unconditional love, Christian hospitality, grace over productivity, and faith without worldly expectations.',
      icon: HeartHandshake,
      count: counts.wisdom,
      countLabel: 'guiding principles',
    },
    {
      id: 'wall' as CategoryType,
      title: 'Community Wall',
      subtitle: 'Fellowship Members & Offerings',
      description: 'Our graduates wall with Google profile avatars, posts shared across seasons, and personal letters of gratitude.',
      icon: Award,
      count: counts.wall,
      countLabel: 'active graduates',
    },
  ];

  return (
    <div className="mb-14">
      <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#2E2A25]">
        <div>
          <h3 className="font-editorial text-2xl text-[#F5EFE3] font-medium tracking-tight">
            The Living Archives
          </h3>
          <p className="text-xs text-[#A8A196] mt-1">
            Choose an archive room to explore memories or contribute your own.
          </p>
        </div>
        <span className="text-xs text-[#6E675D]">
          5 Rooms · Full Access
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-6 rounded-xl bg-[#22201D] hover:bg-[#2B2824] border border-[#2E2A25] hover:border-[#E8B45A]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[#181714] text-[#E8B45A] border border-[#2E2A25] group-hover:border-[#E8B45A]/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Clean unboxed count without pill styling */}
                  <span className="text-xs text-[#6E675D] group-hover:text-[#A8A196] transition-colors tabular-nums">
                    {cat.count} {cat.countLabel}
                  </span>
                </div>

                <h4 className="font-editorial text-xl text-[#F5EFE3] group-hover:text-[#E8B45A] transition-colors font-medium">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#E8B45A]/80 font-medium mt-0.5 mb-2.5">
                  {cat.subtitle}
                </p>
                <p className="text-xs text-[#A8A196] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#2E2A25]/70 flex items-center justify-between text-xs text-[#6E675D] group-hover:text-[#E8B45A] transition-colors">
                <span className="font-medium">Enter room</span>
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
