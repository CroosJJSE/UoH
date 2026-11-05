import { ArchiveItem, Comment, CommunityMember } from '../types';
import { INITIAL_ARCHIVE_ITEMS, INITIAL_MEMBERS } from '../data/initialData';

const STORAGE_KEYS = {
  ITEMS: 'uoh_archive_items_v1',
  MEMBERS: 'uoh_community_members_v1',
  CURRENT_USER: 'uoh_current_user_v1',
};

export const StorageService = {
  getItems(): ArchiveItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading archive items from storage:', e);
    }
    // Initialize default items
    this.saveItems(INITIAL_ARCHIVE_ITEMS);
    return INITIAL_ARCHIVE_ITEMS;
  },

  saveItems(items: ArchiveItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving archive items to storage:', e);
    }
  },

  addItem(item: Omit<ArchiveItem, 'id' | 'createdAt' | 'starsCount' | 'starredBy' | 'comments'>): ArchiveItem {
    const items = this.getItems();
    const newItem: ArchiveItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      starsCount: 1, // Author starts with 1 star
      starredBy: [item.author.email],
      comments: [],
    };
    
    const updated = [newItem, ...items];
    this.saveItems(updated);
    
    // Also increment author's contribution count in members
    this.incrementMemberContribution(item.author.email);
    
    return newItem;
  },

  toggleStar(itemId: string, userEmail: string): { updatedItem: ArchiveItem | null; isStarred: boolean } {
    const items = this.getItems();
    const itemIndex = items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return { updatedItem: null, isStarred: false };

    const item = items[itemIndex];
    const isStarred = item.starredBy.includes(userEmail);

    let updatedStarredBy: string[];
    let updatedStarsCount: number;

    if (isStarred) {
      updatedStarredBy = item.starredBy.filter((e) => e !== userEmail);
      updatedStarsCount = Math.max(0, item.starsCount - 1);
    } else {
      updatedStarredBy = [...item.starredBy, userEmail];
      updatedStarsCount = item.starsCount + 1;
    }

    const updatedItem: ArchiveItem = {
      ...item,
      starredBy: updatedStarredBy,
      starsCount: updatedStarsCount,
    };

    items[itemIndex] = updatedItem;
    this.saveItems(items);

    // Update stars received on the author's community profile
    this.adjustMemberStars(item.author.email, isStarred ? -1 : 1);

    return { updatedItem, isStarred: !isStarred };
  },

  addComment(itemId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Comment | null {
    const items = this.getItems();
    const itemIndex = items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return null;

    const newComment: Comment = {
      ...commentData,
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    items[itemIndex].comments.push(newComment);
    this.saveItems(items);
    return newComment;
  },

  getMembers(): CommunityMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading members from storage:', e);
    }
    this.saveMembers(INITIAL_MEMBERS);
    return INITIAL_MEMBERS;
  },

  saveMembers(members: CommunityMember[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Error saving members:', e);
    }
  },

  incrementMemberContribution(authorEmail: string): void {
    const members = this.getMembers();
    const memberIndex = members.findIndex((m) => m.email.toLowerCase() === authorEmail.toLowerCase());
    if (memberIndex !== -1) {
      members[memberIndex].contributionsCount += 1;
      members[memberIndex].starsEarned += 1;
      this.saveMembers(members);
    }
  },

  adjustMemberStars(authorEmail: string, delta: number): void {
    const members = this.getMembers();
    const memberIndex = members.findIndex((m) => m.email.toLowerCase() === authorEmail.toLowerCase());
    if (memberIndex !== -1) {
      members[memberIndex].starsEarned = Math.max(0, members[memberIndex].starsEarned + delta);
      this.saveMembers(members);
    }
  },

  getCurrentUser(): CommunityMember {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading current user:', e);
    }
    // Default to Rajaraja Croos
    const defaultUser = INITIAL_MEMBERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser(user: CommunityMember): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving current user:', e);
    }
  },

  exportArchive(): void {
    const exportData = {
      communityName: 'University of Hathbodhiya',
      exportDate: new Date().toISOString(),
      items: this.getItems(),
      members: this.getMembers(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hathbodhiya_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  resetDefaults(): void {
    this.saveItems(INITIAL_ARCHIVE_ITEMS);
    this.saveMembers(INITIAL_MEMBERS);
    this.setCurrentUser(INITIAL_MEMBERS[0]);
  }
};
