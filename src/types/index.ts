export type CategoryType = 'all' | 'museum' | 'recipes' | 'memories' | 'wisdom' | 'wall';

export type MuseumSubCategory = 'art' | 'articles' | 'songs';
export type RecipeSubCategory = 'mains' | 'baking' | 'warm_beverages' | 'comfort';
export type WisdomSubCategory = 'faith_perspective' | 'hospitality' | 'golden_advice' | 'reflections';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorEmail: string;
  text: string;
  createdAt: string;
}

export interface ArchiveItem {
  id: string;
  category: 'museum' | 'recipes' | 'memories' | 'wisdom';
  subCategory?: string;
  title: string;
  subtitle?: string;
  content: string;
  images: string[];
  author: {
    name: string;
    email: string;
    avatar: string;
    fellowshipYear?: string;
  };
  createdAt: string;
  starsCount: number;
  starredBy: string[]; // List of user emails
  comments: Comment[];
  
  // Specific category metadata
  metadata?: {
    // For Recipes
    ingredients?: string[];
    steps?: string[];
    prepTime?: string;
    servings?: string;
    secretTouch?: string;
    
    // For Museum Art
    medium?: string;
    yearCreated?: string;
    scriptureVerse?: string;
    
    // For Museum Articles
    readingTime?: string;
    scripturePassage?: string;
    
    // For Museum Songs
    songTitle?: string;
    artist?: string;
    alexaPrompt?: string;
    lyricsSnippet?: string;
    houseMemory?: string;
    
    // For Wisdom
    goldenQuote?: string;
    lifePrinciple?: string;
  };
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gradDegree?: string;
  fellowshipYear: string;
  noteOfGratitude: string;
  starsEarned: number;
  contributionsCount: number;
}
