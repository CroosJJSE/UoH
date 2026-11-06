export const PAGE_SIZE = 24;
export const COMMENT_PAGE_SIZE = 50;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export const DEFAULT_AVATAR = (name: string): string => {
  const seed = encodeURIComponent(name.trim() || 'Fellow');
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=22201d&textColor=e8b45a`;
};
