export type CategoryType = 'all' | 'museum' | 'recipes' | 'memories' | 'wisdom' | 'wall';

export type ArchiveCategory = 'museum' | 'recipes' | 'memories' | 'wisdom';

export type MuseumSubCategory = 'art' | 'articles' | 'songs';
export type RecipeSubCategory = 'mains' | 'baking' | 'warm_beverages' | 'comfort';
export type WisdomSubCategory = 'faith_perspective' | 'hospitality' | 'golden_advice' | 'reflections';

export type UserRole = 'MASTER_ADMIN' | 'ADMIN' | 'MEMBER';
export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  text: string;
  createdAt: string;
}

export interface ArchiveAuthor {
  name: string;
  avatar: string;
  fellowshipYear?: string;
  email?: string;
}

export interface ArchiveItem {
  id: string;
  authorId: string;
  category: ArchiveCategory;
  subCategory?: string;
  title: string;
  content: string;
  images: string[];
  author: ArchiveAuthor;
  createdAt: string;
  starsCount: number;
  starredBy: string[];
    comments: Comment[];
    commentsCount: number;
    metadata?: {
      /** @deprecated kept so old recipe docs still render via recipeDescription() */
      ingredients?: string[];
      steps?: string[];
    medium?: string;
    yearCreated?: string;
    scriptureVerse?: string;
    readingTime?: string;
    scripturePassage?: string;
    songTitle?: string;
    artist?: string;
    alexaPrompt?: string;
    lyricsSnippet?: string;
    houseMemory?: string;
    goldenQuote?: string;
    lifePrinciple?: string;
  };
}

export interface CommunityMember {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  gradDegree?: string;
  fellowshipYear: string;
  noteOfGratitude: string;
  starsEarned: number;
  contributionsCount: number;
  role: UserRole;
  status: AccountStatus;
}

export interface AccountRecord {
  uid: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}

/** Prefer content. If empty, format leftover ingredients/steps from older recipe docs. */
export function recipeDescription(item: { content?: string; metadata?: ArchiveItem['metadata'] }): string {
  if (item.content?.trim()) return item.content;
  const ingredients = item.metadata?.ingredients ?? [];
  const steps = item.metadata?.steps ?? [];
  const parts: string[] = [];
  if (ingredients.length) parts.push(ingredients.map((i) => `• ${i}`).join('\n'));
  if (steps.length) parts.push(steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
  return parts.join('\n\n');
}

export interface ContributionDraft {
  category: ArchiveCategory;
  subCategory: string;
  title: string;
  content: string;
  images: string[];
  metadata?: ArchiveItem['metadata'];
}
